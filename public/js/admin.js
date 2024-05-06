$(document).ready(() => {
    $(".dismiss").on("click", function(event) {
        event.preventDefault();
        const reportId = $(this).data("report-id");
        $.ajax({
            type: "DELETE",
            url: "/admin/dismiss/" +reportId,
            data: {
                reportid: reportId
            },
            success: function(response) {
                // Reload the page after successful request
                location.reload();
            }
        });
    });
    
    $(".remove").on("click", function(event) {
        event.preventDefault();
        const reportId = $(this).data("report-id");
        const postId = $(this).data("post-id");
        $.ajax({
            type: "DELETE",
            url: "/admin/remove/" +postId,
            data: {
                postid: postId,
                reportid: reportId
            },
            success: function(response) {
                // Reload the page after successful request
                location.reload();
            }
        });
    });
    
    $(".ban").on("click", function(event) {
        event.preventDefault();
        const reportId = $(this).data("report-id");
        const userId = $(this).data("user-id");
        const postId = $(this).data("post-id");
        // console.log("ban");
        // console.log(userId+" "+reportId);
        $.ajax({
            type: "DELETE",
            url: "/admin/ban/" +userId,
            data: {
                userid: userId,
                reportid: reportId,
                postid: postId
            },
            success: function(response) {
                // Reload the page after successful request
                location.reload();
            }
        });
    });
})