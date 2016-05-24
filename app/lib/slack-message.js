// External dependencies
var _ = require( 'lodash' ),
    toSentence = require( 'underscore.string/toSentence' );


// Dependencies
//


/**
 * Get colour status dependant on utilization percentage
 */
var getColorStatus = function getColorStatus( utilization ) {
  var percentage = parseInt( utilization, 10 );

  if ( percentage < 20 ) {
    // Black
    color = '#222222';
  } else if ( percentage >= 20 && percentage < 40 ) {
    // Red
    color = '#e23030';
  } else if ( percentage >= 40 && percentage < 60 ) {
    // Orange
    color = '#ff9140';
  } else if ( percentage >= 60 && percentage < 80 ) {
    // Green
    color = '#a7d235';
  } else if ( percentage >= 80 ) {
    // Gold
    color = '#e9dc84';
  }

  return color;
};


/**
 * Slack Message constructor
 */
var SlackMessage = function SlackMessage( data, options ) {
  var message = {},
      startDateFormatted = data.startDate.format( 'dddd, MMMM Do YYYY' ),
      endDateFormatted = data.endDate.format( 'dddd, MMMM Do YYYY' );

  if ( options.public ) {
    message.response_type = 'in_channel';
  }

  message.text = '';
  message.attachments = [
    {
      fallback: data.utilization + ' between ' + startDateFormatted + ' and ' + endDateFormatted,
      color: getColorStatus( data.utilization ),
      fields: [
        {
          title: 'Start date',
          value: startDateFormatted,
          short: true
        },
        {
          title: 'End date',
          value: endDateFormatted,
          short: true
        },
        {
          title: 'Billable vs potential hours',
          value: data.billableHours + ' / ' + data.totalHours,
          short: true
        },
        {
          title: 'Utilisation',
          value: data.utilization,
          short: true
        },
        {
          title: 'Projects',
          value: toSentence( data.projects ),
          short: false
        }
      ]
    }
  ];

  return message;
};


// Exports
module.exports = SlackMessage;
