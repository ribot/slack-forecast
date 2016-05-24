// External dependencies
var express = require( 'express' ),
    bodyParser = require( 'body-parser' );


// Dependencies
var logger = require( './lib/logger' ),
    environment = require( './lib/environment' ),
    router = require( './lib/router' ),
    middleware = require( './lib/routing-middleware' );


// Local variables
var app = express();


/**
 * Initialise
 */
var init = function init() {

  // Setup middleware
  app.use( middleware.removeTrailingSlash );
  app.use( bodyParser.urlencoded( { extended: true } ) );
  app.use( bodyParser.json() );
  app.use( router );
  app.use( middleware.routeNotFound );

  // Setup controllers
  require( './controllers' );

  // Setup jobs
  require( './jobs' );

  // Log the environment
  logger.debug( JSON.stringify( environment ) );

  // Start the server
  app.listen( environment.port, function () {
    logger.debug( 'Forecast insights server running' );
  } );

};

// Get the party started, unless we're running tests
if ( environment.name != 'test' ) {
  init();
}


// Exports
module.exports = {
  init: init,
  app: app
};
