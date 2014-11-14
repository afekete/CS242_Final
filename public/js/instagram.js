var global_next_url = ""

//document ready function for general purposes
$(document).ready(function(){
    localStorage.removeItem('otherPicturesKey')
    localStorage.removeItem('chosenPictureKey')
    // When tag submitted, get text and fetch pictures
    $( "#tag_input" ).submit(function( event ) {
        event.preventDefault();
        var given_tag = $( "#tag_input .form-group .form-control" ).val()
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

//add next picture function - uses pagination to get next url to load more pictures. uses global variable
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

//creates a canvas from the image using an external api from maxnov.com
//creating a canvas allows us to manipulate pixels on the image
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

//analyze the image (called from getCanvasImage) and takes images and gets information from them
//computes average color by calling averageColor method
//local storage is also used with key/value pairs
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
        averageColors = getAvgColors(image_data_array, image.width, image.height, 40, 40);
    }
    else if(type == 'other') {
        averageColors = getAvgColors(image_data_array, image.width, image.height, image.width, image.height);
    }
    else {
        console.log("Type of picture not set")
    }
    var red = averageColors[0][0];
    var green = averageColors[0][1];
    var blue = averageColors[0][2];
    $('#averageColorViewer').css("background-color", "rgb("+red+","+green+","+blue+")")

    if(type == 'chosen') {
        localStorage.setItem("chosenPictureKey", JSON.stringify(averageColors))
        window.location.href = "/mosaic";
    }
    /*
    else if (type == 'other') {
        console.log(localStorage.getItem("otherPicturesKey"))
        var currOtherPics = []
        if (localStorage.getItem("otherPicturesKey") !== null) {
            currOtherPics = JSON.parse(localStorage.getItem("otherPicturesKey"))
        }
        currOtherPics.push([image_data, averageColors])
        localStorage.setItem("otherPicturesKey", JSON.stringify(currOtherPics))
    }
    */
}

//computes average color by sections on image
//takes into 40x40 sections and computes average color by iteration
function getAvgColors(image, totWidth, totHeight, subWidth, subHeight) {
    var averageColors = [];
    for(x = 0; x < totWidth; x+=subWidth) {
        for(y = 0; y < totHeight; y+=subHeight) {
            var avgR = 0;
            var avgG = 0;
            var avgB = 0;

            for(x_sub = x; x_sub < x+subWidth; x_sub++) {
                for(y_sub = y; y_sub < y+subHeight; y_sub++) {
                    var currIndex = getIndex(x_sub, y_sub, totWidth, totHeight);
                    avgR += image[currIndex];
                    avgG += image[currIndex+1];
                    avgB += image[currIndex+2];
                }
            }
            var pixelCt = subWidth*subHeight;
            avgR /= pixelCt;
            avgG /= pixelCt;
            avgB /= pixelCt;
            averageColors.push([Math.floor(avgR), Math.floor(avgG), Math.floor(avgB)]);
        }
    }
    console.log(averageColors);
    return averageColors;
}

//gets index of an area - assume there are four elements: RBG and alpha value
function getIndex(x, y, w, h) {
    return (y*w*4)+(x*4)
}

//for loading icon
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
