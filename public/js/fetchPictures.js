/**
 * Created by Alec on 11/15/2014.
 */
var global_next_url = ""
var otherPictures = []
var picture_generated = false

var NUM_PICS_TO_LOAD = 100

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
var target = document.getElementById('canvases');
var spinner = new Spinner(opts).spin(target);

//document ready function used for general purposes
$(document).ready(function(){
    //console.log(localStorage.getItem("chosenTag"))
    var id = localStorage.getItem("mosaicId")
    if(id !== null) {
        $.get("db/saved/"+id, function (data) {
            localStorage.setItem("chosenTag", data.tag)
            localStorage.setItem("chosenPictureKey", data.colors)
            getAndAddPictures(data.tag, NUM_PICS_TO_LOAD)
        })
    }
    else {
        getAndAddPictures(localStorage.getItem("chosenTag"), NUM_PICS_TO_LOAD)
    }
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
            // Add each image and convert it to a local image
            data.data.forEach(function (picture, index, array) {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'other')
            })
            global_next_url = data.pagination.next_url
            addNextPicture(global_next_url), 5000
        }
    });
}

function addNextPicture(next_url){

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: next_url,
        success: function (data) {
            data.data.forEach(function (picture, index, array) {
                if(index == array.length-1) {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'last')
                }
                else {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'other')
                }
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
        //server: 'http://127.0.0.1:8800',
        extra: type,
        success: analyzeImage,
        error: function(xhr, text_status){
            console.log("Mistakes were made: "+text_status);
            if(!picture_generated) {
                spinner.stop()
                iterate_canvas(otherPictures) // Defined in canvas.js
                picture_generated = true
            }
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

    var averageColors = getAvgColors(image_data_array, image.width, image.height, image.width, image.height)

    otherPictures.push({r: averageColors[0][0], g: averageColors[0][1], b: averageColors[0][2], data: image_data})
    console.log(type)
    if(type == "last") {
        spinner.stop()
        iterate_canvas(otherPictures) // Defined in canvas.js
    }
}



