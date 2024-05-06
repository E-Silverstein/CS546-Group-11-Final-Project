var before_loading = document.getElementById("content-before-loading");
var c = 0;
function getInformation() {
	fetch(`/home/getRecomendedPosts`)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((cardName) => {
            const new_div = document.createElement("div");
            new_div.className = "bg-white shadow-lg p-4 mb-4 rounded-lg cursor-pointer";
            new_div.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">${cardName.username}</h3>
                <img src="${cardName.image}" alt="Post Image" class="w-full h-auto mb-3">
                <p class="mb-1">${cardName.description}</p>
                <p class="text-sm text-gray-600 mb-2">Clothing Links: ${cardName.clothingLinks}</p>
                <p class="text-sm text-gray-600 mb-4">Likes: ${cardName.likes}</p>
            `;

            new_div.addEventListener('click', () => {
                window.location.href = `/posts/${cardName.id}`;
            });

            // Keywords
            if (cardName.keywords.length > 0) {
                const keywords_div = document.createElement("div");
                keywords_div.className = "mb-4";
                keywords_div.innerHTML = "<h4 class='font-semibold mb-2'>Keywords:</h4>";

                cardName.keywords.forEach((keyword) => {
                    const keyword_span = document.createElement("span");
                    keyword_span.className = "bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded";
                    keyword_span.textContent = keyword;
                    keywords_div.appendChild(keyword_span);
                });

                new_div.appendChild(keywords_div);
            }

            // Comments
            if (cardName.comments.length > 0) {
                cardName.comments.forEach((comment) => {
                    const comment_div = document.createElement("div");
                    comment_div.className = "border-t border-gray-200 pt-2 mt-2";
                    comment_div.innerHTML = `
                        <p class="text-sm text-gray-700"><strong>User:</strong> ${comment.user}</p>
                        <p class="text-sm text-gray-700">${comment.text}</p>
                    `;
                    new_div.appendChild(comment_div);
                });
            } else {
                const no_comments_div = document.createElement("div");
                no_comments_div.className = "text-sm text-gray-500 italic mt-2";
                no_comments_div.innerHTML = "No comments";
                new_div.appendChild(no_comments_div);
            }

            before_loading.appendChild(new_div);
        });
        c++;
    })
    .catch((error) => console.error("Error:", error));
}

window.addEventListener("scroll", () => {
if (
    document.documentElement.scrollTop +
    document.documentElement.clientHeight >=
    document.documentElement.scrollHeight
) {
    getInformation();
}
});
getInformation();
