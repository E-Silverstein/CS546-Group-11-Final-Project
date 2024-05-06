$(document).ready(function() {
    console.log("edit user has been loaded")
    $("#edit-user-form").on("submit", (event) => {
        event.preventDefault();
        let username = $('#username');
        let bio = $('#bio');
        let pfp = $('#profile-picture');
    
        let formData = new FormData();
        formData.append('username', username.val());
        formData.append('bio', bio.val());
        if(pfp[0].files[0])
            formData.append('profile-picture', pfp[0].files[0]);
            console.log(pfp[0].files[0])
    
        $.ajax({
            type: "PATCH",
            url: "/users",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response)
            },
            error: function(xhr, status, error) {
                console.log(error)
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
