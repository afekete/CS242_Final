/**
 * Created by Robert on 12/5/2014.
 */
$(document).ready(function(){
    event.preventDefault(); // Prevent redirect on form submission
    var x = localStorage.getItem("username")
    $("#name").text(x)
    $.get("db/saved/"+x, function (data) {
        $("#email").text(data.email)
    })
    $.get("db/saved/", function (data) {
        var mosaicIds = []
        var mosaicTags = []
        for(var k = 0; k < data.length; k++){
            if(data[k].userMade == x){
                mosaicIds.push(data[k]._id)
                mosaicTags.push(data[k].tag)
            }
        }
        for(var i = 0; i < mosaicIds.length;i++){
            console.log("")
            $('#userMosaics').append('<tr>'+'<th>'+mosaicIds[i] +'</th>'+'<th>'+mosaicTags[i] +'</th>'+'</tr>');
        }

    })
})