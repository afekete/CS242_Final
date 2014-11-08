/**
 * Created by Alec on 11/8/2014.
 */
$(document).ready(function() {
    $('.instagram').on('willLoadInstagram', function(event, options) {
        console.log(options);
    });
    $('.instagram').on('didLoadInstagram', function(event, response) {
        console.log(response);
        response.data.forEach(function(picture, index) {
            $('#pattern ul').append(
                '<li><a href="#"><img src="'+picture.images.standard_resolution.url+'"></a></li>'
            )
        })
    });
    $('.instagram').instagram({
        hash: 'latte',
        clientId: '93cfcf70cba44318a06a07ea8e3b6268',
        count: 100
    });
});