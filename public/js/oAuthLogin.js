var NUM_PICS_TO_LOAD = 100
var SUBIMAGE_DIM = 20

//document ready function necessary for simple javascript purposes
$(document).ready(function(){
    localStorage.removeItem('chosenPictureAverages')
    localStorage.removeItem('chosenTag')
    localStorage.removeItem('mosaicId')

    //taking user input as username
    $( "#user_input" ).submit(function( event ) {
        event.preventDefault();
        var given_user_name = $("#user_input .form-group .form-control" ).val()

        search_for_userid(given_user_name)
    });
    //onclick event for mosaic and picture - still working on this
    $(".g").on('click', 'a', function(event){
        event.preventDefault();
        var target = document.getElementById('averageColorViewer');
        var spinner = new Spinner(opts).spin(target);
        if(($(this).data("tag"))!= "undefined")
        {
            localStorage.setItem("chosenTag", $(this).data("tag"))
        }
        else
        {
            localStorage.setItem("chosenTag", "undefined")
        }
        console.log($(this).data("tag"));
        var url = $(this).children("img").attr("src");
        localStorage.setItem("chosenUrl", url)
        window.location.href = "/mosaic";
        return false
    })

    $('#load').click(function(){
        localStorage.setItem("mosaicId", $('.form-control').val())
        window.location.href = "/mosaic";
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
                    '<li><a data-tag = "' + picture.tags[0] + '" href="/mosaic"><img src="' + picture.images.standard_resolution.url + '"></a></li>'

                )
            })
        }

    });
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



