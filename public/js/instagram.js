
var global_next_url = ""
$(document).ready(function(){
    $( "#tag_input" ).submit(function( event ) {
        event.preventDefault();
        var given_tag = $( "#tag_input .form-group .form-control" ).val()
        getAndAddPictures(given_tag, 100)
    });
    $(window).scroll(function(){
        if ($(window).scrollTop()==$(document).height() - $(window).height()){
            if(global_next_url != "")
            {
                addNextPicture(global_next_url)
            }
        }
    });

});

function getAndAddPictures(tag, count) {
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";
    //user_id_kavya = 394307472

    var tag_endpoint = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?count=" + count + "&access_token=" + access_token;
    var popular_endpoint = "https://api.instagram.com/v1/media/popular?count=" + count + "access_token=" + access_token;
    //var user_endpoint = "https://api.instagram.com/v1/users/" + user_id_kavya + "/media/recent?access_token=" + access_token;

    $.ajax({

        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: tag_endpoint,
        success: function (data) {
            $('#pattern ul').empty()
            data.data.forEach(function (picture, index) {
                $('#pattern ul').append(
                    '<li><a href="#"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )
                getCanvasFromImage(picture.images.standard_resolution.url)

            })

            global_next_url = data.pagination.next_url
            addNextPicture(global_next_url)

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
            data.data.forEach(function (picture, index) {
                $('#pattern ul').append(
                    '<li><a href="#"><img src="' + picture.images.standard_resolution.url + '"></a></li>'
                )
            })
            global_next_url = data.pagination.next_url
        }
    });
}

function getCanvasFromImage(image_url){

    $.getImageData({
        url: image_url,
        success: analyzeAndDraw,
        error: function(xhr, text_status){

        }
    });
}

function analyzeAndDraw(image){
    var can = document.createElement('canvas');
    var ctx = can.getContext('2d');

    $(can).attr('width', image.width);
    $(can).attr('height', image.height);

    ctx.drawImage(image, 0, 0, image.width, image.height)

    var image_data = ctx.getImageData(0,0,image.width, image.height);
    var image_data_array = image_data.data;
    var image_data_array_length = image_data_array.length;

    var a=[0,0,0];

    for (var i = 0; i < image_data_array_length; i+=4){
        a[0] = a[0] + image_data_array[i]
        a[1] = a[1] + image_data_array[i+1];
        a[2] = a[2] + image_data_array[i+2];
    }

    a[0] = Math.round(a[0]/=(image_data_array_length)/3));
    //a[1] = Math.round(a[1]/=(image_data_a)
}



