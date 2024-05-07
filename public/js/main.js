/* This file handles anything that needs to happen for every page. ex: load page-specific script */

// Dynamically load the script for the current page

$(document).ready(function() {
//     const currPath = window.location.pathname;
//     let scriptName = currPath.split("/");
//     // if the path is for home no not load a script
//     if(scriptName[1] === "home") return;
//     if(scriptName.length > 3 && (scriptName[1] === "posts" || scriptName[1] === "users")) {
//         scriptName = scriptName[2];
//     } else {
//         if(scriptName.length === 3 && scriptName[1] === "users" && scriptName[2] === "editUser") scriptName = scriptName[2];
//         else scriptName = scriptName[1];
//     }
//     $("<script>").attr("src", "/public/js/" + scriptName + ".js").appendTo("head");
// });

let keywords = [];
    // Handle the Search Bar
    $('#search').on('input', (event) => {
        // Add keyword when user inputs a comma
        event.preventDefault();
        const search = $('#search').val().trim();
        if (search.includes(',')) {
            const keyword = search.substring(0, search.indexOf(',')).trim();
            if(keyword.length >= 3 && keyword.length <= 16 && !keywords.includes(keyword) && keywords.length < 5) {
                keywords.push(keyword);
                $('#searchbar').prepend(
                    `<span class="bg-icon200 flex my-4 space-x-2 text-icon900 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded align-center">
                        <p class=align-center>${keyword}<p>
                        <button type="button" class="removeKeyword">x</button>
                    </span>`);
                $('#search').val('');
            }
        }
    });

    $('#searchbar').on('click', '.removeKeyword', (event) => {
        // Remove keyword when user clicks the x button
        event.preventDefault();
        let parent = event.target.parentElement;
        keywords.splice(keywords.indexOf(parent.firstChild.innerText), 1);
        parent.parentElement.remove();
    });

    $('#searchbar').on('submit', (event) => {
        // submit the search request
        event.preventDefault();
        const search = $('#search').val().trim();
        window.location.href = '/search?keywords=' + keywords.join(',') + '&query=' + search;
    });
});