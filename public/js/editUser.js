$(document).ready(function() {


    console.log("edit user has been loaded")
    $("#edit-user-form").on("submit", (event) => {


        event.preventDefault();


        
        let username = $('#username');
        let bio = $('#bio');
        let pfp = $('#profile-picture');
        $("#error").remove();
    
        let formData = new FormData();


        console.log("username: " + username.val());
        console.log("bio: " + bio.val());
        console.log("pfp: " + pfp[0].files[0]);
        formData.append('username', username.val());
        formData.append('bio', bio.val());
        if(pfp[0].files[0] != undefined)
            formData.append('profile-picture', pfp[0].files[0]);
         
    
        $.ajax({
            type: "PATCH",
            url: "/users",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log("SUCCESS:" +response);
                window.location.href = "/users";
            },
            error: function(xhr, status, error) {
                console.log("ERROR:" +error);
                $("#edit-user-form").append("<p id='error'>Error: " + error + "</p>");
            }
        });
    
    });

    $("#delete-user-form").on("submit", (event) => {
        $.ajax({
            type: "DELETE",
            url: "/users"
        });
    });

})