/* This file handles anything that needs to happen for every page. ex: load page-specific script */

// Dynamically load the script for the current page
$(document).ready(function() {
    const currPath = window.location.pathname;
    let scriptName = currPath.split("/");
    if(scriptName.length > 3 && (scriptName[1] === "posts" || scriptName[1] === "users")) {
        scriptName = scriptName[2];
    } else {
        if(scriptName.length === 3 && scriptName[1] === "users" && scriptName[2] === "editUser") scriptName = scriptName[2];
        else scriptName = scriptName[1];
    }
    $("<script>").attr("src", "/public/js/" + scriptName + ".js").appendTo("head");
});