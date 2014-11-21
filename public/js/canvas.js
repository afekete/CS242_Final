// Uses https://github.com/ubilabs/kd-tree-javascript

var IMAGE_DIM = 640; // Dimension of the full image
var SUBIMAGE_DIM = 20; // Dimension of the sub images
var IMAGE_CT_DIM = IMAGE_DIM/SUBIMAGE_DIM; // Dimension of the mosaic (how many images in one dimension)

/**
 * Iterate over the canvases and find the best picture from possiblePictures for the corresponding average color
 * @param possiblePictures An array of objects containing image datas and their average colors
 */
function iterate_canvas(possiblePictures) {
    // Create a kd tree with the possible pictures
    var tree = new kdTree(possiblePictures, distance, ["r", "g", "b"]);

    // Get the average colors of the chosen picture from local storage
    var chosenColors = JSON.parse(localStorage.getItem("chosenPictureAverages"));

    // Calculate the scaling factor
    var scale = SUBIMAGE_DIM/IMAGE_DIM; // new dimension / original dimension

    for (var x = 0; x < IMAGE_CT_DIM; x++) {
        for (var y = 0; y < IMAGE_CT_DIM; y++) {
            //progressJs().increase()

            // Get the current canvas
            var currCanvas = document.getElementById("main_canvas" + "_" + x + "_" + y);

            // Get the average colors for the current subarray, then create an object of those colors
            var currColors = chosenColors[x+(y*IMAGE_CT_DIM)];
            var colorObj = {r: currColors[0], g: currColors[1], b: currColors[2]};

            // Find the nearest neighbor to the average colors
            var pic = tree.nearest(colorObj, 1);
            pic = pic[0][0];

            var ctx = currCanvas.getContext("2d");

            // Scale the chosen pic through some temp canvas tricks and draw it
            var tempCanvas = document.createElement('canvas');
            var tempCtx = tempCanvas.getContext('2d');
            $(tempCanvas).attr('width', IMAGE_DIM);
            $(tempCanvas).attr('height', IMAGE_DIM);
            tempCtx.putImageData(pic.data, 0, 0);
            ctx.clearRect(0, 0, tempCanvas.width*scale, tempCanvas.height*scale);
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width*scale, tempCanvas.height*scale);

        }
    }
}

/**
 * Calculate the distance between two nodes
 * Used by the kd tree
 * @param a One node
 * @param b A different node
 * @returns {number} The difference between a and b
 */
function distance(a, b) {
    var diffR = Math.abs(a.r - b.r);
    var diffG = Math.abs(a.g - b.g);
    var diffB = Math.abs(a.b - b.b);
    return (diffR+diffG+diffB)/3;
}

// Runs on page load. Sets up jquery listeners.
$(document).ready(function() {
    // Send the provided id, the tag, and the average colors to the database to store the mosaic
    $("#save").click(function(){
        var newMosaic={
            '_id' : $( "input" ).val(),
            'tag' : localStorage.getItem("chosenTag"),
            'colors' : localStorage.getItem("chosenPictureAverages")
        };
        $.ajax({
            url: "/db/saved",
            type: "POST",
            data: newMosaic,
            dataType: "JSON"
        }).done(function( msg ) {
            console.log(msg);
        });
    });

    var arr = [];
    // Rotates the picture counterclockwise when the corresponding button is clicked
    $("#Left").click(function(){
        for (var y = IMAGE_CT_DIM-1; y >=0 ; y--) {
            for ( var x = 0; x < IMAGE_CT_DIM; x++) {
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                var ctx = c.getContext("2d");
                arr.push(ctx.getImageData(0,0,SUBIMAGE_DIM,SUBIMAGE_DIM))
            }
        }
        for (x = 0; x < IMAGE_CT_DIM; x++) {
            for (y = 0; y < IMAGE_CT_DIM; y++) {
                c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                ctx = c.getContext("2d");
                ctx.putImageData(arr.shift(),0,0)
            }
        }
    });

    $("#Flip").click(function(){
        for (var x = IMAGE_CT_DIM-1; x >=0 ; x--) {
            for ( var y = 0; y < IMAGE_CT_DIM; y++) {
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                var ctx = c.getContext("2d");
                arr.push(ctx.getImageData(0,0,SUBIMAGE_DIM,SUBIMAGE_DIM))
            }
        }
        for (x = 0; x < IMAGE_CT_DIM; x++) {
            for (y = 0; y < IMAGE_CT_DIM; y++) {
                c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                ctx = c.getContext("2d");
                ctx.putImageData(arr.shift(),0,0)
            }
        }
    });

    $("#Right").click(function(){
        for (var y = 0; y <IMAGE_CT_DIM ; y++) {
            for ( var x = IMAGE_CT_DIM-1; x >=0; x--) {
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                //console.log(c)
                var ctx = c.getContext("2d");
                arr.push(ctx.getImageData(0,0,SUBIMAGE_DIM,SUBIMAGE_DIM))
            }
        }
        for (x = 0; x < IMAGE_CT_DIM; x++) {
            for (y = 0; y < IMAGE_CT_DIM; y++) {
                c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                ctx = c.getContext("2d");
                ctx.putImageData(arr.shift(),0,0)
            }
        }
    });

    // Inverts the mosaic colors when the corresponding button is clicked
    $("#Invert").click(function(){
        for(var x = 0; x < IMAGE_CT_DIM; x++){
            for(var y = 0; y < IMAGE_CT_DIM; y++){
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y);
                var ctx = c.getContext("2d");
                var image_data = ctx.getImageData(0,0, SUBIMAGE_DIM, SUBIMAGE_DIM);
                var image_data_array = image_data.data;
                console.log(image_data_array);
                var image_data_array_length = image_data_array.length;

                // Accumulate the pixel colours
                for (var i = 0; i < image_data_array_length; i += 4){
                    image_data_array[i] = 255 - image_data_array[i];
                    image_data_array[i+1] = 255 - image_data_array[i+1];
                    image_data_array[i+2] = 255 - image_data_array[i+2];
                }

                ctx.putImageData(image_data, 0, 0);
            }
        }
    })

});
