for (var x =0;x < 16 ; x++) {
    for (var y =0;y < 16 ; y++) {
        var c = document.getElementById("main_canvas"+"_"+x+"_"+y);
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#88"+ ((x*10)+20).toString(16)+ ((y*10)+20).toString(16);
        ctx.fillRect(0, 0, 40, 40);
    }
}