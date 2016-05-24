// External dependencies
var _ = require( 'lodash' ),
    toSentence = require( 'underscore.string/toSentence' );


// Dependencies
//


/**
 * Get colour status dependant on capacity percentage
 */
var getColorStatus = function getColorStatus( capacity ) {
  var percentage = parseInt( capacity, 10 );

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
var SlackMessage = function SlackMessage( data ) {
  return {
    text: '',
    attachments: [
      {
        fallback: data.capacity + ' between ' + data.dateStart + ' and ' + data.dateEnd,
        color: getColorStatus( data.capacity ),
        fields: [
          {
            title: 'Start date',
            value: data.startDate.format( 'dddd, MMMM Do YYYY' ),
            short: true
          },
          {
            title: 'End date',
            value: data.endDate.format( 'dddd, MMMM Do YYYY' ),
            short: true
          },
          {
            title: 'Billable vs potential hours',
            value: data.billableHours + ' / ' + data.totalHours,
            short: true
          },
          {
            title: 'Capacity',
            value: data.capacity,
            short: true
          },
          {
            title: 'Projects',
            value: toSentence( data.projects ),
            short: false
          }
        ]
      }
    ]
  }
};


// Exports
module.exports = SlackMessage;
