$("#edit-user-form").on("submit", (event) => {
    event.preventDefault();
    let username = $(username);
    let bio = $(bio);
    
    $.ajax({
        type: "PATCH",
        url: "/users",
        data: {
            "username": username,
            "bio": bio
        }
    });
    
});

$("#delete-user-form").on("submit", (event) => {
    $.ajax({
        type: "DELETE",
        url: "/users"
    });
});