function iterate_canvas(possiblePictures) {
    var chosenColors = JSON.parse(localStorage.getItem("chosenPictureKey"))
    var scale = 20/640 // new dimension / original dimension
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            var c = document.getElementById("main_canvas" + "_" + x + "_" + y);
            var pic = getClosestPicture(chosenColors[x+(y*32)], possiblePictures, 0)
            var ctx = c.getContext("2d");

            var tempCanvas = document.createElement('canvas');
            var tempCtx = tempCanvas.getContext('2d');
            $(tempCanvas).attr('width', 640);
            $(tempCanvas).attr('height', 640);
            tempCtx.putImageData(pic, 0, 0);
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

$(document).ready(function() {

    $("button").click(function(){
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

})
