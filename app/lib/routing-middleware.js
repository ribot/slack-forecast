// External dependencies
//


// Dependencies
var logger = require( './logger' ),
    environment = require( './environment' ),
    ResponseError = require( './response-error' ),
    ValidationError = require( './validation-error' );


/**
 * Redirect URLs with trailing slash
 * eg. /me/ to /me
 */
var removeTrailingSlash = function removeTrailingSlash ( request, response, next ) {

  if ( request.url.substr( -1 ) == '/' && request.url.length > 1 ) {
    response.redirect( 301, request.url.slice( 0, -1 ) );
  } else {
    next();
  }

};


/**
 * Respond with a 404 ResponseError
 */
var routeNotFound = function routeNotFound( request, response, next ) {
  var responseError = new ResponseError( 'notFound' );

  response.status( responseError.statusCode ).send( responseError );

};


// Exports
module.exports = {
  removeTrailingSlash: removeTrailingSlash,
  routeNotFound: routeNotFound
};
