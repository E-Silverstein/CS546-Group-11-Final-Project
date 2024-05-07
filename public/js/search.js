const likeButton = $(".likeButton");
likeButton.on("click", function() {
    const postId = likeButton.data("id");
    const liked = likeButton.data("liked");

    if (liked) {
      fetch(`/posts/removeLike/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) throw data.error;
          likeButton.text(`Likes: ${data.likes.length}`);
          likeButton.data("liked", "false");
        })
        .catch(
          (error) =>
            (window.location.href = "/error?error=" + error)
        );
    } else {
        fetch(`/posts/addLike/${postId}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) throw data.error;
            likeButton.text(`Dislike: ${data.likes.length}`);
            likeButton.data("liked", "true");
            })
            .catch(
            (error) =>
                (window.location.href = "/error?error=" + error)
            );
    }
});