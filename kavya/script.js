    jQuery(function($) {
  $('.instagram').on('willLoadInstagram', function(event, options) {
    console.log(options);
  });
  $('.instagram').on('didLoadInstagram', function(event, response) {
    console.log(response);
  });
  $('.instagram').instagram({
    hash: 'love', //hashtag for the images 
    clientId: '93cfcf70cba44318a06a07ea8e3b6268' //my own client id
  });