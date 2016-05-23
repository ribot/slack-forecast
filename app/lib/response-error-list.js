// External dependencies
//


// Dependencies
//


var errors = {
  'notFound': {
    message: 'Unknown resource. Please double check the request URL!',
    statusCode: 404
  },
  'invalidData': {
    message: 'Invalid request data!',
    statusCode: 400
  },
  'notImplemented': {
    message: 'We haven\'t got round to that one yet.',
    statusCode: 501
  },
  'unknown': {
    message: 'Oh dear.',
    statusCode: 500,
    aliases: [
      'wtf'
    ]
  }
};


// Exports
module.exports = errors;
