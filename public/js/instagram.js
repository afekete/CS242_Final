var global_next_url = ""

//document ready function used for general purposes
$(document).ready(function(){
    localStorage.removeItem('otherPicturesKey')
    localStorage.removeItem('chosenTag')
    // When tag submitted, get text and fetch pictures
    $( "#tag_input" ).submit(function( event ) {
        event.preventDefault();
        var given_tag = $( "#tag_input .form-group .form-control" ).val()
        localStorage.setItem("chosenTag", given_tag)
        getAndAddPictures(given_tag, 100)
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
        event.preventDefault();
        var target = document.getElementById('averageColorViewer');
        var spinner = new Spinner(opts).spin(target);
        var url = $(this).children("img").attr("src");
        getCanvasFromImage(url, 'chosen');
        return false
    })

    $('#load').click(function() {
        localStorage.setItem("mosaicId", $('.form-control').val())
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
            $('#pattern ul').empty()

            // Add each image and convert it to a local image
            data.data.forEach(function (picture, index) {
                $('#pattern ul').append(
                    '<li><a href="/mosaic"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )
                if(index <= 0) {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'other')
                }

            })

            global_next_url = data.pagination.next_url
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
            })
            global_next_url = data.pagination.next_url
        }
    });
}

//make a 'local' canvas out of the image using an api from maxnov.com
//using this api we can create a temp canvas and manipulate aspects of the image
function getCanvasFromImage(image_url, type){
    $.getImageData({
        url: image_url,
        server: 'http://maxnov.com/getimagedata/getImageData.php',
        extra: type,
        success: analyzeImage,
        error: function(xhr, text_status){
            console.log("Mistakes were made: "+text_status);
        }
    });
}

//analyzeImage gets necessary data we need to analyze the image
//analyzes average colors and calls averageColors function to compute average colors
//local storage with some key/value items
function analyzeImage(image, type){
    var can = document.createElement('canvas');
    var ctx = can.getContext('2d');

    $(can).attr('width', image.width);
    $(can).attr('height', image.height);

    ctx.drawImage(image, 0, 0, image.width, image.height)

    var image_data = ctx.getImageData(0,0,image.width, image.height);
    var image_data_array = image_data.data;
    var image_data_array_length = image_data_array.length;

    var averageColors = []
    if(type == 'chosen') {
        averageColors = getAvgColors(image_data_array, image.width, image.height, 20, 20);
        var red = averageColors[0][0];
        var green = averageColors[0][1];
        var blue = averageColors[0][2];
        $('#averageColorViewer').css("background-color", "rgb("+red+","+green+","+blue+")")

        localStorage.setItem("chosenPictureKey", JSON.stringify(averageColors))
        window.location.href = "/mosaic";
    }
    else {
        console.log("Type of picture not set")
    }
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
