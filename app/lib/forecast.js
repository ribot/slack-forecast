// External dependencies
var Forecast = require( 'forecast-api' ),
    Promise = require( 'bluebird' ),
    _ = require( 'lodash' ),
    moment = require( 'moment' ),
    momentRange = require( 'moment-range' );


// Dependencies
var environment = require( './environment' ),
    logger = require( './logger' );


// Create the Forecast instance
var forecast = Promise.promisifyAll( new Forecast( {
  accountId: environment.forecast.accountId,
  authorization: 'Bearer ' + environment.forecast.accessToken
} ), { suffix: 'Promise' } );


/**
 * Tap results from Forecast
 */
var resultCheck = function( result ) {
  if ( result === undefined ) {
    throw new Error( 'Couldn\'t retrieve data from Forecast' );
  }
};


/**
 * Get production team people
 */
var getPeople = function getPeople() {
  return forecast.peoplePromise()
    .tap( resultCheck );
};


/**
 * Filter out non-production people
 */
var filterPeople = function( people ) {
  var chain = _.chain( people )
    // Filter production team
    .filter( function( person ) {
      return _.includes( person.teams, 'Production' );
    } )
    // Reject archived team members
    .reject( function( person ) {
      return person.archived;
    } );

  return chain.value();
};


/**
 * Get external projects
 */
var getProjects = function getProjects() {
  return forecast.projectsPromise()
    .tap( resultCheck );
};


/**
 * Filter out non-billable projects
 */
var filterProjects = function filterProjects( projects ) {
  var chain = _.chain( projects )
    // Reject projects without a project code (e.g. Time Off)
    .reject( function( project ) {
      return project.code === null;
    } )
    // Reject internal projects
    .reject( function( project ) {
      return _.startsWith( project.code, 'RIB' ) || _.startsWith( project.code, 'COG' );
    } )

  return chain.value();
};


/**
 * Get assignments for this week
 */
var getAssignments = function getAssignments( options ) {
  return forecast.assignmentsPromise( options )
    .tap( resultCheck );
};


/**
 * Filter out non-billable assignments using filtered projects and people collections
 */
var filterAssignments = function filterAssignments( assignments, projects, people ) {
  var chain = _.chain( assignments )
    // Filter by production people
    .filter( function( assignment ) {
      return _.some( people, { id: assignment.person_id } );
    } )
    // Filter by external projects
    .filter( function( assignment ) {
      return _.some( projects, { id: assignment.project_id } );
    } );

  return chain.value();
};


/**
 * Get all data, resolves when all data has been fetched and filtered
 */
var get = function get( options ) {
  return Promise.props( {
    people: getPeople().then( filterPeople ),
    projects: getProjects().then( filterProjects ),
    assignments: getAssignments( options )
  } )
    .bind( this )
    .then( function( results ) {
      this.results = results;
      return filterAssignments( results.assignments, results.projects, results.people );
    } )
    .then( function( filteredAssignments ) {
      return _.extend( {}, this.results, { assignments: filteredAssignments } );
    } );
};


/**
 * Get scheduled hours using results and date range options
 * TODO: Omit weekends
 */
var getScheduledHours = function getScheduledHours( results, options ) {
  return _.reduce( results.assignments, function( memo, assignment ) {
    var queryRange = moment.range( options.startDate, options.endDate ),
        assignmentDateRange = moment.range( assignment.start_date, assignment.end_date ),
        overlapRange = queryRange.intersect( assignmentDateRange ),
        assignmentScheduledHours = ( overlapRange.diff( 'days' ) * assignment.allocation ) / 60 / 60;

    return ( memo += assignmentScheduledHours );
  }, 0 );
};


/**
 * Get a list of billable projects from the results
 */
var getProjectList = function( results ) {
  var chain = _.chain( results.assignments )
    .map( function( assignment ) {
      return _.find( results.projects, { id: assignment.project_id } ).name;
    } )
    .union();

  return chain.value();
};


/**
 * Get capacity and project list
 * TODO: Omit weekends from date range before calculating totalHours
 */
var getInfo = function getInfo( options ) {
  return get( options )
    .then( function( results ) {
      var numberOfDays = moment.range( options.startDate, options.endDate ).diff( 'days' ),
          totalHours = results.people.length * 7 * numberOfDays,
          billableHours = getScheduledHours( results, options ),
          capacity = Math.round( billableHours / totalHours * 100 ) + '%',
          projects = getProjectList( results );

      return {
        startDate: options.startDate,
        endDate: options.endDate,
        numberOfDays: numberOfDays,
        totalHours: totalHours,
        billableHours: billableHours,
        capacity: capacity,
        projects: projects
      };
    } );
};


// Exports
module.exports = {
  get: get,
  getInfo: getInfo
};
