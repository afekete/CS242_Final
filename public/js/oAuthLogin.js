//document ready function necessary for simple javascript purposes
$(document).ready(function(){
    //taking user input as username
    $( "#user_input" ).submit(function( event ) {
        event.preventDefault();
        var given_user_name = $("#user_input .form-group .form-control" ).val()
        search_for_userid(given_user_name)
    });
    //onclick event for mosaic and picture - still working on this
    $(".g").on('click', 'a', function(event){
        event.preventDefault();
        var url = $(this).children("img").attr("src");
        getCanvasFromImage(url, 'chosen');
        return false
    })
});

//takes in userinput (an instagram username) and makes a call to the api to get the actual userid for the username
function search_for_userid(given_user_name){
    var clientId = "93cfcf70cba44318a06a07ea8e3b6268";
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";

    var user_endpoint = "https://api.instagram.com/v1/users/search?q=" +given_user_name+ "&access_token=" + access_token;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: user_endpoint,
        success:function(data){
            var user_id = data.data[0].id;
            console.log(user_id)
            username_pics(user_id);
        }
    });
}

//taken a given user id - lists all the recent media for that user
//users access token reserved to a single user
//cannot get all media - only recent media (restriction by Instagram api)
function username_pics(user_id){
    var clientId = "93cfcf70cba44318a06a07ea8e3b6268";
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";

    var media_endpoint = "https://api.instagram.com/v1/users/"+user_id+"/media/recent?access_token="+access_token;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: media_endpoint,
        success:function(data) {
            $('#pattern ul').empty()
            data.data.forEach(function (picture, index) {
                $('#pattern ul').append(
                    '<li><a href="/mosaic"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )
                if(index <= 0){
                    getCanvasFromImage(picture.images.standard_resolution.url, 'other')
                }
            })
        }

    });
}

//making a 'local' canvas from the image that is clicked
//uses maxnov.com for this part as they have a useful js api for it
//calls analyzeImage
function getCanvasFromImage(image_url, type) {
    $.getImageData({
        url: image_url,
        server: 'http://maxnov.com/getimagedata/getImageData.php',
        extra: type,
        success: analyzeImage,
        error: function (xhr, text_status) {
            console.log("Mistakes were made: " + text_status);
        }
    });
}

//analyzing image by getting more information from canvas
//local storage of some elements and key value pairs
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
}

//computes average color of an image by section
//section is currently 40x40 pixels and makes a list of average RBG values in that section and appends to list
//returns the list to the above function
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

//gets index for an area - iterate 4 times because RBG and alpha for each pixel
function getIndex(x, y, w, h) {
    return (y*w*4)+(x*4)
}
//loading icon stuff
//used for when waiting for images to load (pagination issues) or connectivity to api issues
//also some problems when creating canvas and connection to that sdk
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



