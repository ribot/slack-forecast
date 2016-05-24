// External dependencies
var dotenv = require( 'dotenv' );


// Dependencies
//


var environmentName = process.env.NODE_ENV || process.env.node_env || 'development';


// Use .env file for development and test
if ( environmentName === 'development' || environmentName === 'test' ) {
  dotenv.load();
}


var environment = {
  project: 'Forecast Insights',
  name: environmentName,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  forecast: {
    accountId: process.env.FORECAST_ACCOUNT_ID,
    accessToken: process.env.FORECAST_ACCESS_TOKEN
  },
  slack: {
    commandToken: process.env.SLACK_COMMAND_TOKEN
  }
};


// Exports
module.exports = environment;
