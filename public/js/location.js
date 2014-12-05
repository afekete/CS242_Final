/**
 * Created by kavya on 12/4/14.
 */

var NUM_PICS_TO_LOAD = 100
var SUBIMAGE_DIM = 20

//document ready function necessary for simple javascript purposes
$(document).ready(function(){
    localStorage.removeItem('chosenPictureAverages')
    localStorage.removeItem('chosenTag')
    localStorage.removeItem('mosaicId')

    //taking location input here
    $( "#location_input" ).submit(function( event ) {
        event.preventDefault();
        var given_location = $("#location_input .form-group .form-control" ).val()

        search_for_location(given_location)
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

var geocoder;
//takes in a given location and uses google maps api to get the lat and long coordinates and then connects to the instagram api to get
function search_for_location(given_location){
    var long;
    var lat;
    geocoder = new google.maps.Geocoder();
    console.log(geocoder);
    geocoder.geocode( { 'address': location}, function(results, status)
    {
        if(status == google.maps.GeocoderStatus.OK)
        {
            lat = results[0].geometry.location.latitude
            long = results[0].geometry.location.longitude

        }
        else
        {
         lat = 0;
         long = 0;
        }
    });

   /* var long;
    var lat;
    console.log(given_location);
    if (given_location == "paris"){
        long =48.8567
        lat = 2.3508
    }
    else if (given_location == "chicago")
    {
        long = 41.8369
        lat = 87.6847
    }*/
    var clientId = "93cfcf70cba44318a06a07ea8e3b6268";
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";
    var location_endpoint = "https://api.instagram.com/v1/locations/search?lat=" + lat + "&lng=" + long + "&access_token=" + access_token;

    console.log(location_endpoint);
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: location_endpoint,
        success:function(data){
            console.log(data);
            var location_id = data.data[0].id
            console.log(location_id)
            location_pics(location_id)
        }
    });
}

//taken a given location - lists all the recent media for that user
//geolocation using location id and access token to instagram api
function location_pics(location_id){
    var clientId = "93cfcf70cba44318a06a07ea8e3b6268";
    var access_token = "394307472.93cfcf7.cc10311c67174728a0baef44810d5c0c";

    var location_endpoint = "https://api.instagram.com/v1/locations/"+ location_id+ "6/media/recent?access_token=" + access_token;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: location_endpoint,
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





