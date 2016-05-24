// External dependencies
var Promise = require( 'bluebird' ),
    _ = require( 'lodash' );


// Dependencies
var logger = require( './logger' ),
    ResponseError = require( './response-error' ),
    ValidationError = require( './validation-error' );


/**
 * Respond when recovering from an error
 */
var respondWithError = function respondWithError( response, responseError ) {
  if ( !response.headersSent ) {
    return response.status( responseError.statusCode ).send( responseError );
  } else {
    logger.warn( 'Tried to respond twice when error thrown' );
  }
};


/**
 * Attach default catches for a promise within a response handler
 */
var wrapResponse = function wrapResponse( promise ) {
  return function( request, response, next ) {
    return promise.apply( null, arguments )
      .catch( ValidationError, function( validationError ) {
        throw new ResponseError( 'invalidData', {
          errors: validationError.errors
        } );
      } )
      .catch( ResponseError, function( responseError ) {
        return respondWithError( response, responseError );
      } )
      .catch( function ( error ) {
        var responseError = new ResponseError( 'unknown' );
        logger.error( 'Unhandled request error', error.stack );
        return respondWithError( response, responseError );
      } );
  }
};


// Exports
module.exports = wrapResponse;
