/* This file handles anything that needs to happen for every page. ex: load page-specific script */

// Dynamically load the script for the current page
$(document).ready(function() {
    const currPath = window.location.pathname;
    let scriptName = currPath.split("/");
    scriptName = scriptName[scriptName.length - 1];
    if (scriptName === "/") {
        scriptName = "home";
    }
    $("<script>").attr("src", "/public/js/" + scriptName + ".js").appendTo("head");
});