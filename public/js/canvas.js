// Uses https://github.com/ubilabs/kd-tree-javascript

//global variables
var IMAGE_DIM = 640
var SUBIMAGE_DIM = 20
var IMAGE_CT_DIM = IMAGE_DIM/SUBIMAGE_DIM


//iterate through canvas to get possible pictures for the mosaic
//users maxnov.com server
function iterate_canvas(possiblePictures) {
    var tree = new kdTree(possiblePictures, distance, ["r", "g", "b"]);

    var chosenColors = JSON.parse(localStorage.getItem("chosenPictureKey"))
    var scale = SUBIMAGE_DIM/IMAGE_DIM // new dimension / original dimension
    for (x = 0; x < IMAGE_CT_DIM; x++) {
        for (y = 0; y < IMAGE_CT_DIM; y++) {
            //progressJs().increase()

            var c = document.getElementById("main_canvas" + "_" + x + "_" + y)

            var currColors = chosenColors[x+(y*IMAGE_CT_DIM)]
            var colorObj = {r: currColors[0], g: currColors[1], b: currColors[2]}
            var pic = tree.nearest(colorObj, 1)
            pic = pic[0][0]

            var ctx = c.getContext("2d");

            var tempCanvas = document.createElement('canvas');
            var tempCtx = tempCanvas.getContext('2d');
            $(tempCanvas).attr('width', IMAGE_DIM);
            $(tempCanvas).attr('height', IMAGE_DIM);
            tempCtx.putImageData(pic.data, 0, 0);
            ctx.clearRect(0, 0, tempCanvas.width*scale, tempCanvas.height*scale);
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width*scale, tempCanvas.height*scale);

            /*
            var red = chosenColors[x + (y * 16)][0].toString(16)
            if(red.length == 1) {red = '0'.concat(red)}
            var blue = chosenColors[x + (y * 16)][1].toString(16)
            if(blue.length == 1) {blue = '0'.concat(blue)}
            var green = chosenColors[x + (y * 16)][2].toString(16)
            if(green.length == 1) {green = '0'.concat(green)}
            //console.log('#'+red+blue+green)
            ctx.fillStyle = '#'+red+blue+green
            ctx.fillRect(0, 0, 40, 40);
            */
        }
    }
}

//getting distance of R B G values
function distance(a, b) {
    var diffR = Math.abs(a.r - b.r);
    var diffG = Math.abs(a.g - b.g);
    var diffB = Math.abs(a.b - b.b);
    return (diffR+diffG+diffB)/3;
}

//document on load script
$(document).ready(function() {

    //click to save mosaic - saves urls of images that make the mosaic to the database
    $("#save").click(function(){
        var newMosaic={
            '_id' : $( "input" ).val(),
            'tag' : localStorage.getItem("chosenTag"),
            'colors' : localStorage.getItem("chosenPictureKey")
        }
        $.ajax({
            url: "/db/saved",
            type: "POST",
            data: newMosaic,
            dataType: "JSON"
        }).done(function( msg ) {
            console.log(msg);
        });
    })

    //rotate left 90degrees - takes each image on the mosaic and rotates
    var arr = []
    $("#Left").click(function(){
        for (var y = IMAGE_CT_DIM-1; y >=0 ; y--) {
            for ( var x = 0; x < IMAGE_CT_DIM; x++) {
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y)
                //console.log(c)
                var ctx = c.getContext("2d");
                arr.push(ctx.getImageData(0,0,SUBIMAGE_DIM,SUBIMAGE_DIM))
            }
        }
        for (x = 0; x < IMAGE_CT_DIM; x++) {
            for (y = 0; y < IMAGE_CT_DIM; y++) {
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y)
                var ctx = c.getContext("2d");
                ctx.putImageData(arr.shift(),0,0)
            }
        }
    })

    //inverts colors on the image. 255-currentRBG values
    //displays it on the current mosaic directly
    $("#Invert").click(function(){
        for(var x = 0; x < IMAGE_CT_DIM; x++){
            for(var y = 0; y < IMAGE_CT_DIM; y++){
                var c = document.getElementById("main_canvas" + "_" + x + "_" + y)
                //console.log(c)
                var ctx = c.getContext("2d");
                var image_data = ctx.getImageData(0,0, SUBIMAGE_DIM, SUBIMAGE_DIM);
                var image_data_array = image_data.data;
                //console.log(image_data_array)
                var image_data_array_length = image_data_array.length;

                var a=[0,0,0];

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

})
