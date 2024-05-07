function handleDelete(postId) {
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
};
