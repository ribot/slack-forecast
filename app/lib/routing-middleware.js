// External dependencies
var Promise = require( 'bluebird' );


// Dependencies
var logger = require( './logger' ),
    environment = require( './environment' ),
    ResponseError = require( './response-error' ),
    ValidationError = require( './validation-error' ),
    wrapResponse = require( './response-wrapper' );


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
  return Promise.reject( new ResponseError( 'notFound' ) );
};


/**
 * Basic check to see if the query token matches
 */
var authorizeSlack = function authorizeSlack( request, response, next ) {

  if ( request.query.token !== environment.slack.commandToken ) {
    throw new ResponseError( 'unauthorized' );
  }

  return Promise.resolve( next() );
};


// Exports
module.exports = {
  removeTrailingSlash: removeTrailingSlash,
  routeNotFound: wrapResponse( routeNotFound ),
  authorizeSlack: wrapResponse( authorizeSlack )
};
