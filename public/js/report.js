$(document).ready(() => {
    $(document).on("click", ".report",function(event) {
        event.preventDefault();
        const postId = $(this).data("post-id");
        $(this).after('<input type="text" class="report-reason" id="report-' + postId + '"  placeholder="Enter reason for reporting...">');
        $(this).after('<button class="submit-report" data-report-reason="{{report-reason}}">Submit</button>');
        $(this).hide();
    });

    $(document).on("click",".submit-report",function(event) {
        event.preventDefault();
        $("#error").remove();
        const postId = $('.report').data("post-id");
        const username = $('.report').data("reported-user");
        const reportReason = document.getElementById("report-" + postId).value;
        //TODO: Not working for posts other than first one, fix this
        let errors = [];

        if(reportReason.length ==0){
            errors.push("Cannot submit empty reason");
        }

        if(typeof reportReason != 'string'){
            errors.push("Reason has to be a string");
        }

        if(!reportReason.match(/^[0-9a-zA-Z]+$/)){
            errors.push("Reason can only be alphanumeric");
        }

        if (errors.length) {
            event.preventDefault();
            $(this).append(`<p id='error'>Invalid Inputs: ${errors.join(", ")}</p>`);
            $(this).reset();
        }

        $.ajax({
            type: "POST", 
            url: "/reports", 
            data: {
                postId: postId,
                username: username,
                reason: reportReason
            },
            success: function(response) {
                // Optionally, do something after successful report handling
                console.log("Report submitted successfully");
                // Remove the text input and submit button
                // $(this).prev(".report-reason").remove();
                // $(this).remove();
                // // Show the report button again
                // $(this).closest(".report").find(".report-button").show();
            },
            error: function(xhr, status, error) {
                // Handle errors if any
                console.error("Error submitting report:", error);
            }
        });
        // Remove the text input and submit button
        $("#report-" + postId).remove();
        $(this).remove();
        // Show the report button again
        $(".report[data-post-id='" + postId + "']").show();
    });


});