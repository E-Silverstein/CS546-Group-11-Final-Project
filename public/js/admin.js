let reportId = $('#dismiss').data("report-id");
let postId = $('#remove').data("post-id");
let userId = $('#ban').data("user-id");

$("#dismiss").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/admin/dismiss/" +reportId,
        data: {
            reportid: reportId
        }
    });
});

$("#remove").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/admin/remove/" +postId,
        data: {
            postid: postId,
            reportid: reportId
        }
    });
});

$("#ban").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/admin/ban/" +userId,
        data: {
            userid: userId,
            reportid: reportId
        }
    });
});