/**
 * Created by Robert on 12/4/2014.
 */
$(document).ready(function(){
    $( "#registration" ).submit(function( event ) {
        event.preventDefault(); // Prevent redirect on form submission
        var reg_username = $("#registration").find("#username").val();
        var reg_email = $("#registration").find("#email").val();
        var reg_email2 = $("#registration").find("#emailsecond").val();
        var reg_password = $("#registration").find("#password").val();
        var reg_password1 = $("#registration").find("#passwordsecond").val();
        if(reg_email == reg_email2 && reg_password == reg_password1) {
            var user = {
                '_id':reg_username,
                'email':reg_email,
                'password':reg_password
            };
            $.ajax({
                url: "/db/saved",
                type: "POST",
                data: user,
                dataType: "JSON"
            }).done(function (msg) {
                console.log(msg);
            });
            console.log('added')
            window.location.href = "/signin"
        }
        else{
            if(reg_email!=reg_email2){
                alert('Emails do not match')
            }
            if(reg_password!=reg_password1){
                alert('Password do not match')
            }
        }
    });
})