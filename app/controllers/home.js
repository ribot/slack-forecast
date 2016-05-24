// External dependencies
//


// Dependencies
var router = require( '../lib/router' ),
    wrapResponse = require( '../lib/response-wrapper' );


/**
 * Initialise
 */
var init = function() {

  router.get( '/', wrapResponse( requestGetHome ) );

};


/**
 * Request GET /
 * Used to test the service is running
 */
var requestGetHome = function requestGetHome( request, response ) {
  return response.status( 200 ).send();
};


// Initialise
init();


// Exports
//
