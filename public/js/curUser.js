/**
 * Created by Robert on 12/5/2014.
 */

$(document).ready(function(){
    var x=localStorage.getItem("username")
    if(x!=null){
        $("#curUser").text(x)
        $("#curUser").attr("href", "/profile")
        $("#signout").text('Sign out')
    }
    else{
        $("#curUser").text('Sign In')
    }
})