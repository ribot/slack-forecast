// External dependencies
var moment = require( 'moment' ),
    _ = require( 'lodash' ),
    Promise = require( 'bluebird' );


// Dependencies
var router = require( '../lib/router' ),
    environment = require( '../lib/environment' ),
    middleware = require( '../lib/routing-middleware' ),
    forecast = require( '../lib/forecast' ),
    SlackMessage = require( '../lib/slack-message' ),
    ResponseError = require( '../lib/response-error' ),
    ValidationError = require( '../lib/validation-error' ),
    wrapResponse = require( '../lib/response-wrapper' );


/**
 * Initialise
 */
var init = function() {

  router.get( '/slack', middleware.authorizeSlack, wrapResponse( requestGetSlackCommand ) );

};


/**
 * Transform Slack command into options object
 */
var transformCommand = function commandToOptions( text ) {
  var args = _.chain( text )
    .words()
    // Transform pass
    .map( function( value, index ) {

      if ( index === 0 ) {
        return parseInt( value, 10 );
      } else if ( index === 1 ) {
        return _.chain( value ).lowerCase().trimEnd( 's' ).value();
      } else {
        return value;
      }

    } )
    // Validation pass
    .each( function( value, index ) {
      var validationErrors = {};

      if ( index === 0 ) {
        if ( value === NaN || value < 1 || value > 4 ) {
          validationErrors.value = [ 'Value must be between 1–4' ];
        }
      }
      if ( index === 1 ) {
        if ( !( value == 'week' || value == 'month' ) ) {
          validationErrors.unit = [ 'Unit must be weeks or months' ];
        }
      }

      if ( !_.isEmpty( validationErrors ) ) {
        throw new ValidationError( validationErrors );
      }

    } )
    .value();

  return {
    value: args[ 0 ],
    unit: args[ 1 ]
  };
};


/**
 * Transform command to options object
 */
var commandToOptions = function( command ) {
  var startDate = moment().startOf( command.unit ),
      endDate = startDate.clone().add( command.value, command.unit );

  return {
    groupBy: command.value,
    startDate: startDate,
    endDate: endDate
  };
};


/**
 * Request GET /slack-commands
 * Handles incoming Slack commands
 */
var requestGetSlackCommand = function requestGetSlackCommand( request, response ) {
  return Promise.try( function() {
    var command = transformCommand( request.query.text );
    return commandToOptions( command );
  } )
    .then( function( options ) {
      return forecast.getInfo( options )
        .catch( function( error ) {
          throw new ResponseError( 'forecastError' );
        } );
    } )
    .then( function( data ) {
      var payload = new SlackMessage( data );
      return response.status( 200 ).send( payload );
    } );
};


// Initialise
init();


// Exports
//
