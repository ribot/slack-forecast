// External dependencies
var Forecast = require( 'forecast-api' ),
    Promise = require( 'bluebird' ),
    _ = require( 'lodash' ),
    moment = require( 'moment' );


// Dependencies
var environment = require( './environment' ),
    logger = require( './logger' );


var forecast = Promise.promisifyAll( new Forecast( {
  accountId: environment.forecast.accountId,
  authorization: 'Bearer ' + environment.forecast.accessToken
} ), { suffix: 'Promise' } );


/**
 * Get production team people
 */
var getPeople = function getPeople() {
  return forecast.peoplePromise()
    .then( function( people ) {
      return _.chain( people )
        // Filter production team
        .filter( function( person ) {
          return _.includes( person.teams, 'Production' );
        } )
        // Reject archived team members
        .reject( function( person ) {
          return person.archived;
        } )
        .value();
    } );
};


/**
 * Get external projects
 */
var getProjects = function getProjects() {
  return forecast.projectsPromise()
    .then( function( projects ) {
      return _.chain( projects )
        // Reject projects without a project code (e.g. Time Off)
        .reject( function( project ) {
          return project.code === null;
        } )
        // Reject internal projects
        .reject( function( project ) {
          return _.startsWith( project.code, 'RIB' ) || _.startsWith( project.code, 'COG' );
        } )
        .value();
    } );
};


/**
 * Get assignments for this week
 */
var getAssignments = function getAssignments( options ) {
  return forecast.assignmentsPromise( options );
};


/**
 * Get all data, resolves when all data has been fetched
 */
var get = function get( options ) {
  return Promise.props( {
    people: getPeople(),
    projects: getProjects(),
    assignments: getAssignments( options )
  } );
};


// Exports
module.exports = {
  get: get
};
