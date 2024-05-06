let form = $("#loginForm");
console.log(form);

form.on("submit", function(event) {
    $("#error").remove();

    let username = $("#username").val().trim().toLowerCase();
    let password = $("#password").val().trim();

    if (username === "" || password === "" || username.match(/[-\w\.]{5,32}/) === null || password.length < 8 || password.length > 32 || 
            password.match(/[0-9]/) === null || password.match(/[A-Z]/) === null || password.match(/[-’\/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/) === null) {
        event.preventDefault();
        form.append("<p id='error'>Username or Password is invalid.</p>");
        form[0].reset();
    }
    
});