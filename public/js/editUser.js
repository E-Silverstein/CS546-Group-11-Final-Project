$("#edit-user-form").on("submit", (event) => {
    let username = $('#username');
    let bio = $('#bio');
    event.preventDefault();
    
    console.log("ajax");
    $.ajax({
        type: "PATCH",
        url: "/users",
        data: {
            "username": username[0].value,
            "bio": bio[0].value
        }
    });
    
});

$("#delete-user-form").on("submit", (event) => {
    $.ajax({
        type: "DELETE",
        url: "/users"
    });
});