let userform = $("#edit-user-form");

userform.on("load", (event) => {
    let user = $.cookie("AuthenticationState");

    $(profile-picture).val(user.profilePicture);
    $(username).val(user.username);
    $(bio).val(user.bio);
});

userform.on("submit", (event) => {
    let user = $.cookie("AuthenticationState");
    console.log(user);

    let username = $(username);
    let bio = $(bio);
    
    $.ajax({
        type: "PATCH",
        url: "/users/" + user._id,
        data: {
            username: username,
            bio: bio
        }
    });
    
});

$("#delete-user-form").on("submit", (event) => {
    let user = $.cookie("AuthenticationState").user;

    $.ajax({
        type: "DELETE",
        url: "/users/" + user._id
    });
});