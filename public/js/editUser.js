$("#edit-user-form").on("submit", (event) => {
    let username = $(username);
    let bio = $(bio);
    event.preventDefault();
    
    console.log("ajax");
    $.ajax({
        type: "PATCH",
        url: "/users",
        data: {
            "username": username,
            "bio": bio
        },
        error: () => console.log("ERROR"),
        success: (data) => console.log("SUCCESS")
    });
    
});

$("#delete-user-form").on("submit", (event) => {
    $.ajax({
        type: "DELETE",
        url: "/users"
    });
});