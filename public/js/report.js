$(document).ready(() => {
    let hold = '';
    let user = '';
    let activeReport = null;
    $(document).on("click", ".report",function(event) {
        event.preventDefault();
        if (activeReport !== null) {
            $(activeReport).siblings(".report-reason").remove();
            $(activeReport).siblings(".submit-report").remove();
            $(activeReport).show();
        }

        const postId = $(this).data("post-id");
        hold = postId;
        const username = $(this).data("reported-user");
        user = username;
        activeReport = this;

        $(this).after('<input type="text" class="report-reason" id="report-' + postId + '"  placeholder="Enter reason for reporting...">');
        $(this).after('<button class="submit-report" data-report-reason="{{report-reason}}">Submit</button>');
        $(this).hide();
    });

    $(document).on("click",".submit-report",function(event) {
        event.preventDefault();
        $("#error").remove();
        const postId = hold;
        const username = user;
        const reportReason = document.getElementById("report-" + postId).value;
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
                console.log("Report submitted successfully");
                // Remove the text input and submit button
                // $(this).prev(".report-reason").remove();
                // $(this).remove();
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

        activeReport = null;
    });


});