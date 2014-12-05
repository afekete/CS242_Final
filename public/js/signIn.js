/**
 * Created by Robert on 12/4/2014.
 */
$(document).ready(function(){
    $( "#logon" ).submit(function( event ) {
        event.preventDefault(); // Prevent redirect on form submission
        var logon_name = $("#logon").find("#inputUser").val();
        var logon_pass = $("#logon").find("#inputPassword").val();

        if(logon_name != null){
            $.get("db/saved/"+logon_name, function (data){
                var correct_password = data.password
                if(logon_pass == correct_password){
                    localStorage.setItem("username", logon_name);
                    window.location.href = "/main"
                }
                else{
                    alert('Password is wrong')
                }
            })
        }
    })

})