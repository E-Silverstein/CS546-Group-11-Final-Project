let form = $("#signupForm");
let message = $("message");

if (message) console.log(message);
form.on("submit", function(event) {
    $("#error").remove();

    let username = $("#username").val().trim().toLowerCase();
    let birthdate = $("#birthdate").val().trim();
    let password = $("#password").val().trim();
    let confirmPassword = $("#confirmPassword").val().trim();
    birthdate = new Date(birthdate);

    let errors = [];

    if(username === "" || username.match(/^[-\w\.]{5,32}$/) === null) {
        errors.push("username");
    }

    if(birthdate === "" || (Date.now() - birthdate) / (1000 * 60 * 60 * 24 * 365.25) < 13) {
        errors.push("birthdate");
    }
    
    if(password === "" || password.length < 8 || password.length > 32 || password.match(/[0-9]/) === null || password.match(/[A-Z]/) === null || 
        password.match(/[-’\/`~!#*$@_%+=\.,^&(){}[\]|;:”<>?\\]/) === null) {
        errors.push("password");
    };

    if(confirmPassword === "" || password !== confirmPassword) {
        errors.push("confirm password");
    }
    
    if (errors.length) {
        event.preventDefault();
        form.append(`<p id='error'>Invalid Inputs: ${errors.join(", ")}</p>`);
        form[0].reset();
    }
    
});