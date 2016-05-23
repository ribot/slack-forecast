// External dependencies
var moment = require( 'moment' );


// Dependencies
var router = require( '../lib/router' ),
    forecast = require( '../lib/forecast' );


/**
 * Initialise
 */
var init = function() {
  
  router.post( '/slack-commands', requestPostSlackCommand );

};


/**
 * Request POST /slack-commands
 * Handles incoming Slack commands
 */
var requestPostSlackCommand = function requestPostSlackCommand( request, reponse ) {
  response.status( 200 ).send();
};


// Initialise
init();


// Exports
//
