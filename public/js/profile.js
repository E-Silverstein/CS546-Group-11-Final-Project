document.addEventListener("DOMContentLoaded", function() {
    const followButton = document.querySelector('.follow-button');
    if (followButton) {
        followButton.addEventListener('click', function() {
            const userId = this.dataset.userid;
            const profileUsername = this.dataset.profileusername;
            const isFollowing = this.textContent.trim() === 'Unfollow';
            let url;
            console.log("userId:", userId);  
            if (isFollowing) {
                url = `/users/unfollow/${profileUsername}`;
            } else {
                url = `/users/follow/${profileUsername}`;
            }

            fetch(url, { 
                method: 'PATCH',
                body: JSON.stringify({ userid: userId })
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Something went wrong with the follow/unfollow operation');
                    }
                })
                .then(data => {
                    console.log(data); // Log the server's response
                    const followerCountElement = document.querySelector('p[data-id="follower-count"]');
                    let followerCount = parseInt(followerCountElement.textContent.split(': ')[1]);
                    if (isFollowing) {
                        followerCount -= 1;
                        this.textContent = 'Follow';
                    } else {
                        followerCount += 1;
                        this.textContent = 'Unfollow';
                    }
                    followerCountElement.textContent = `Follower Count: ${followerCount}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }
});