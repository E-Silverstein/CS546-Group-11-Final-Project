
$(document).ready(function() {

   console.log("editpost scriipt")

    // $("form").on("submit", (event) => {
    //     let desc = $(description);
    //     let clothingLinks = $(clothingLinks);
    //     let keywords = $(keywords);
       
    //     event.preventDefault();
        
    //     $.ajax({
    //         type: "PATCH",
    //         url: "/posts/" + postId,
    //         data: {
    //             description: desc,
    //             clothingLinks: clothingLinks,
    //             keywords: keywords
    //         }
    //     });
    // });

    $("#delete-button").on("click", (event) => {
        event.preventDefault();

        let currPath = window.location.pathname;
        let postId = currPath.substring(currPath.lastIndexOf("/") + 1);

        console.log("nfieenfiein")
        
        $.ajax({
            type: "DELETE",
            url: "/posts/" + postId,    
            success: function(response) {
                console.log("SUCCESS:" +response);
                window.location.href = "/users";
                
            },
            error: function(xhr, status, error) {
                console.log("ERROR:" +error);
               
            }
        });
    });

});