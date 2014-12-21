// Stores the pagination url with the next set of pictures
var global_next_url = "";

// The number of pictures we request from the instagram API
var NUM_PICS_TO_LOAD = 100;

// Runs when the page is loaded. Sets up jquery listeners and localStorage.
$(document).ready(function(){
    // Remove localStorage so old values don't mess things up
    localStorage.removeItem('chosenPictureAverages');
    localStorage.removeItem('chosenTag');
    localStorage.removeItem('mosaicId');
    // When tag submitted, get text and fetch pictures with that tag
    $( "#tag_input" ).submit(function( event ) {
        event.preventDefault(); // Prevent redirect on form submission
        var given_tag = $( "#tag_input").find(".form-group .form-control" ).val();
        localStorage.setItem("chosenTag", given_tag);
        getAndAddPictures(given_tag, NUM_PICS_TO_LOAD)
    });

    // Load more pictures when user scrolls to bottom
    $(window).scroll(function(){
        if ($(window).scrollTop()==$(document).height() - $(window).height()){
            if(global_next_url != "")
            {
                addNextPicture(global_next_url)
            }
        }
    });

    // Do stuff with picture you click on
    $(".g").on('click', 'a', function(event) {
        event.preventDefault(); // Prevent redirect on click

        // Create spinner
        var target = document.getElementById('averageColorViewer');
        var spinner = new Spinner(opts).spin(target);

        // Get url of chosen image
        var url = $(this).children("img").attr("src");
        // Save it into local storage
        localStorage.setItem("chosenUrl", url);
        // Then redirect to the mosaic page
        window.location.href = "/mosaic";
        return false
    });

    // Load mosaic with the id in the text box
    $('#load').click(function() {
        localStorage.setItem("mosaicId", $('.form-control').val());
        window.location.href = "/mosaic";
    })
});

/**
 * Gets pictures with submitted tag from instagram, displays them, and gets local copy of them
 * @param tag The tag to get pictures for
 * @param count How many pictures to get
 */
function getAndAddPictures(tag, count) {
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";

    var tag_endpoint = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?count=" + count + "&access_token=" + access_token;

    // Instagram ajax call
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: tag_endpoint,
        success: function (data) {
            // Remove previous images when switching tags
            $('#pattern').find('ul').empty();

            // Add each image and convert it to a local image
            data.data.forEach(function (picture, index) {
                $('#pattern').find('ul').append(
                    '<li><a href="/mosaic"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )

            });

            global_next_url = data.pagination.next_url;
            addNextPicture(global_next_url)

        }
    });
}

//using pagination to add next picture because we need to load more images as the page ends
//use another feature from api called pagination.next_url to get more images
function addNextPicture(next_url){

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: next_url,
        success: function (data) {
            data.data.forEach(function (picture, index) {
                $('#pattern ul').append(
                    '<li><a href="/mosaic"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )
            });
            global_next_url = data.pagination.next_url
        }
    });
}

//loading icon stuff
var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};
