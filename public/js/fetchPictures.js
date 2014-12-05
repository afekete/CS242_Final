/**
 * Created by Alec on 11/15/2014.
 */
var global_next_url = ""; // Stores the next pagination url
var otherPictures = []; // Stores the pictures and their average colors from instagram
var picture_generated = false; // Tracks whether the picture has started being generated or not

var NUM_PICS_TO_LOAD = 100; // Number of pictures to request from the instagram api
var IMAGE_DIM = 640; // Dimension of the full image
var SUBIMAGE_DIM = 20; // Dimension of the sub images
var IMAGE_CT_DIM = IMAGE_DIM/SUBIMAGE_DIM; // Dimension of the mosaic (how many images in one dimension)

//loading icon options
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
// Create spinner
var target = document.getElementById('canvases');
var spinner = new Spinner(opts).spin(target);

// Runs when the page is loaded. Sets up jquery listeners and localStorage.
$(document).ready(function(){
    var id = localStorage.getItem("mosaicId");

    for(var x=0; x<IMAGE_CT_DIM; x++) {
        for (var y=0;y<IMAGE_CT_DIM;y++) {
            $('#canvases').append('<canvas id="main_canvas_' + x + '_' + y + '" width=' + SUBIMAGE_DIM + ' height=' + SUBIMAGE_DIM + '\>')
        }
    }

    // If the id is set, load the info from the database into localStorage
    if(id !== null) {
        $.get("db/saved/"+id, function (data) {
            localStorage.setItem("chosenTag", data.tag);
            localStorage.setItem("chosenPictureAverages", data.colors);
            getAndAddPictures(data.tag, NUM_PICS_TO_LOAD)
        })
    }
    // Otherwise the tag and average colors are already set so just load the mosaic
    else {
        convertToLocal(localStorage.getItem("chosenUrl"), false);
        getAndAddPictures(localStorage.getItem("given_tag"), NUM_PICS_TO_LOAD)
    }

    $('#Inc').click(function() {
        SUBIMAGE_DIM /= 2;
        IMAGE_CT_DIM = IMAGE_DIM/SUBIMAGE_DIM; // Dimension of the mosaic (how many images in one dimension)
        $('canvas').remove();
        for(var x=0; x<IMAGE_CT_DIM; x++) {
            for (var y=0;y<IMAGE_CT_DIM;y++) {
                $('#canvases').append('<canvas id="main_canvas_' + x + '_' + y + '" width=' + SUBIMAGE_DIM + ' height=' + SUBIMAGE_DIM + '\>')
            }
        }
        convertToLocal(localStorage.getItem("chosenUrl"), true);
    });

    $('#Dec').click(function() {
        SUBIMAGE_DIM *= 2;
        IMAGE_CT_DIM = IMAGE_DIM/SUBIMAGE_DIM; // Dimension of the mosaic (how many images in one dimension)
        $('canvas').remove();
        for(var x=0; x<IMAGE_CT_DIM; x++) {
            for (var y=0;y<IMAGE_CT_DIM;y++) {
                $('#canvases').append('<canvas id="main_canvas_' + x + '_' + y + '" width=' + SUBIMAGE_DIM + ' height=' + SUBIMAGE_DIM + '\>')
            }
        }
        convertToLocal(localStorage.getItem("chosenUrl"), true);
    })
});

/**
 * Gets pictures with submitted tag from instagram and calls function to convert them to local images
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
            // Add each image and call function that converts it to a local image
            data.data.forEach(function (picture) {
                getCanvasFromImage(picture.images.standard_resolution.url, 'other')
            });
            // Save the next url for pagination
            global_next_url = data.pagination.next_url;
            // Load the next page of pictures
            addNextPicture(global_next_url)
        }
    });
}

/**
 * make a 'local' canvas out of the image using an api from maxnov.com or localhost
 * using this api we can create a temp canvas and manipulate aspects of the image
 * @param image_url Url of the image to convert
 * @param type Whether or not the image is the last one to be loaded (either 'last' or 'other')
 */
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
                spinner.stop();
                //progressJs().start()
                iterate_canvas(otherPictures, SUBIMAGE_DIM); // Defined in canvas.js
                picture_generated = true
            }
        }
    });
}

/**
 * analyzeImage gets necessary data we need to analyze the image
 * analyzes average colors and calls averageColors function to compute average colors
 * local storage with some key/value items
 * @param image The local image to use in a canvas
 * @param type Whether the image is the last one or not
 */
function analyzeImage(image, type){

    // Create an invisible canvas to manipulate the image
    var can = document.createElement('canvas');
    var ctx = can.getContext('2d');

    $(can).attr('width', image.width);
    $(can).attr('height', image.height);

    // Add the image to the canvas and get the image data from the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    var image_data = ctx.getImageData(0,0,image.width, image.height);
    var image_data_array = image_data.data;

    // Get the average colors of the image
    var averageColors = getAvgColors(image_data_array, image.width, image.height, image.width, image.height);

    // Add an object to the otherPictures array for each picture with the average colors and the image data
    otherPictures.push({r: averageColors[0][0], g: averageColors[0][1], b: averageColors[0][2], data: image_data});
    console.log(type); // Tracks how many pictures are loaded
    if(type == "last") {
        spinner.stop();
        //progressJs().start()
        iterate_canvas(otherPictures, SUBIMAGE_DIM); // Defined in canvas.js, creates the mosaic
    }

}

function addNextPicture(next_url){
    // Instagram ajax call
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: next_url,
        success: function (data) {
            data.data.forEach(function (picture, index, array) {
                // If at the last picture, mark it as last so the mosaic starts generating
                if(index == array.length-1) {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'last')
                }
                else {
                    getCanvasFromImage(picture.images.standard_resolution.url, 'other')
                }
            });
            // Save the next pagination url
            global_next_url = data.pagination.next_url
        }
    });
}

/**
 * make a 'local' canvas out of the image using an api from maxnov.com or localhost
 * using this api we can create a temp canvas and manipulate aspects of the image
 * @param image_url Url of the image to convert
 * @param gen_image If true, generate the image at the end of getAverages
 */
function convertToLocal(image_url, gen_image){
    $.getImageData({
        url: image_url,
        server: 'http://maxnov.com/getimagedata/getImageData.php',
        //server: 'http://127.0.0.1:8800',
        extra: gen_image,
        success: getAverages,
        error: function(xhr, text_status){
            console.log("Failed to convert: "+text_status);
        }
    });
}

/**
 * analyzeImage gets necessary data we need to analyze the image
 * analyzes average colors and calls averageColors function to compute average colors
 * local storage with some key/value items
 * @param image The local image to use in a canvas
 * @param gen_image If true, generate the image at the end of the function
 */
function getAverages(image, gen_image){
    // Create an invisible canvas to manipulate the image
    var can = document.createElement('canvas');
    var ctx = can.getContext('2d');

    $(can).attr('width', image.width);
    $(can).attr('height', image.height);

    // Add the image to the canvas and get the image data from the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    var image_data = ctx.getImageData(0,0,image.width, image.height);
    var image_data_array = image_data.data;

    // Get the average colors of the image
    var averageColors = getAvgColors(image_data_array, image.width, image.height, SUBIMAGE_DIM, SUBIMAGE_DIM);

    // Save average colors to local storage and redirect to /mosaic
    localStorage.setItem("chosenPictureAverages", JSON.stringify(averageColors));

    if(gen_image) {
        iterate_canvas(otherPictures, SUBIMAGE_DIM);
    }
}
