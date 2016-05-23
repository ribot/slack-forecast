// External dependencies
var winston = require( 'winston' );


// Dependencies
var environment = require( './environment' );


var logger;


/**
 * Initialise
 */
var init = function init() {

  // Create an array contraining the console logging transport
  var transports = [ new winston.transports.Console( {
    colorize: true,
    level: environment.logLevel
  } ) ];

  // Create the winston logger with the correct transports and error types
  logger = new winston.Logger( {
    transports: transports,
    levels: {
      'debug': 0,
      'info': 1,
      'warn': 2,
      'error': 3
    },
    exitOnError: false
  } );

};


// Initialise
init();


// Exports
module.exports = logger;
