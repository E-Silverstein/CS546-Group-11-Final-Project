document.addEventListener('DOMContentLoaded', function() {
    var container = document.querySelector('.mt-24');

    container.addEventListener('click', function(event) {
        if (event.target.classList.contains('like-button') || event.target.classList.contains('dislike-button')) {
            const button = event.target;
            const isLiking = button.classList.contains('like-button');
            const actionUrl = isLiking ? `/posts/addLike/${button.getAttribute('data-id')}` : `/posts/removeLike/${button.getAttribute('data-id')}`;
            const methodAction = isLiking ? "Like" : "Dislike";

            fetch(actionUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: button.getAttribute('data-userid') }),
            })
            .then(response => response.json())
            .then(data => {
                button.textContent = `${methodAction === "Like" ? "Dislike" : "Like"}: ${data.likes.length}`;
                button.classList.toggle('like-button', methodAction !== "Like");
                button.classList.toggle('dislike-button', methodAction === "Like");
            })
            .catch(error => console.error("Error:", error));
        }
    });

    $("#delete-comment").on("click", function() {
        const ids = $(this).attr("data-id");
        const postId = ids.split(":")[0];
        const commentId = ids.split(":")[1];

        fetch(`/comments/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ commentid: commentId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `/posts/${postId}`;
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
