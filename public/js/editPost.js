$("form").on("submit", (event) => {
    let desc = $(description);
    let clothingLinks = $(clothingLinks);
    let keywords = $(keywords);
    let currPath = window.location.pathname;
    let postId = currPath.substring(currPath.lastIndexOf("/") + 1);
    
    $.ajax({
        type: "PATCH",
        url: "/posts/" + postId,
        data: {
            description: desc,
            clothingLinks: clothingLinks,
            keywords: keywords
        }
    });
});