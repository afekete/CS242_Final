function iterate_canvas() {
    var chosenColors = JSON.parse(localStorage.getItem("chosenPictureKey"))
    //var possiblePictures = JSON.parse(localStorage.getItem("otherPicturesKey"))
    for (x = 0; x < 16; x++) {
        for (y = 0; y < 16; y++) {
            var c = document.getElementById("main_canvas" + "_" + x + "_" + y);

            //var pic = getClosestPicture(chosenColors[x+(y*16)], possiblePictures, 10)
            //console.log(pic)
            var ctx = c.getContext("2d");
            //ctx.putImageData(pic, 0, 0);

            var red = chosenColors[x + (y * 16)][0].toString(16)
            if(red.length == 1) {red = '0'.concat(red)}
            var blue = chosenColors[x + (y * 16)][1].toString(16)
            if(blue.length == 1) {blue = '0'.concat(blue)}
            var green = chosenColors[x + (y * 16)][2].toString(16)
            if(green.length == 1) {green = '0'.concat(green)}
            console.log('#'+red+blue+green)
            ctx.fillStyle = '#'+red+blue+green
            ctx.fillRect(0, 0, 40, 40);

        }
    }
}

$(document).ready(function() {
    /*
    for (var x =0;x < 16 ; x++) {
        for (var y =0;y < 16 ; y++) {
            var c = document.getElementById("main_canvas"+"_"+x+"_"+y);
            var ctx = c.getContext("2d");
            ctx.fillStyle = "#88"+ ((x*10)+20).toString(16)+ ((y*10)+20).toString(16);
            ctx.fillRect(0, 0, 40, 40);
        }
    }
    */
    iterate_canvas()
})