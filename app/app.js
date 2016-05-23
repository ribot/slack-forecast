// External dependencies
var moment = require( 'moment' );


// Dependencies
var forecast = require( './lib/forecast' );


forecast.get( {
  startDate: moment().day( 'Monday' ),
  endDate: moment().day( 'Saturday' )
} )
  .tap( console.log );


// Exports
//
