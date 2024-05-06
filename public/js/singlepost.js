document.addEventListener('DOMContentLoaded', function() {
    var container = document.querySelector('.mt-24');

    container.addEventListener('click', function(event) {
        if (event.target.classList.contains('like-button')) {
            
            const button = event.target;
            const postId = button.getAttribute('data-id');
            const userId = button.getAttribute('data-userid');
            fetch(`/posts/addLike/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: userId }),
            })
            .then(response => response.json())
            .then(data => {
                button.textContent = `Dislike: ${data.likes.length}`;
                button.classList.replace('like-button', 'dislike-button');
            })
            .catch(error => console.error("Error:", error));
        } else if (event.target.classList.contains('dislike-button')) {
            const button = event.target;
            const postId = button.getAttribute('data-id');

            fetch(`/posts/removeLike/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: button.getAttribute('data-userid') }),
            })
            .then(response => response.json())
            .then(data => {
                button.textContent = `Like: ${data.likes.length}`;
                button.classList.replace('dislike-button', 'like-button');
            })
            .catch(error => console.error("Error:", error));
        }
    });
});
