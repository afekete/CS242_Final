/**
 * Created by Alec on 11/8/2014.
 */
$(document).ready(function() {
    $( "#tag_input" ).submit(function( event ) {
        event.preventDefault();
        var given_tag = $( "#tag_input .form-group .form-control" ).val()
        getAndAddPictures(given_tag, 100)
    });
});

function getAndAddPictures(hash, count) {
    $('.pattern').on('willLoadInstagram', function(event, options) {
        console.log(options);
    });
    $('.pattern').on('didLoadInstagram', function(event, response) {
        console.log(response);
        $('#pattern ul').empty()
        response.data.forEach(function(picture, index) {
            $('#pattern ul').append(
                '<li><a href="#"><img src="'+picture.images.standard_resolution.url+'"></a></li>'
            )
        })
    });
    $('.pattern').instagram({
        hash: hash,
        clientId: '93cfcf70cba44318a06a07ea8e3b6268',
        count: count
    });
}