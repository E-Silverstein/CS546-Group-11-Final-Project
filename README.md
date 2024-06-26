# CS546 Group 11 Final Project

A fashion-focused social media application designed to help users discover fashions and styles that match their preferences.

## How To Use

Install dependencies

```
npm i
```

Seed the database

```
npm run seed
```

Start the application

```
npm start
```

## Core Features

### Sign Up Page

* Page that allows the user to sign up and create a user for the website
* Then leads users to a login page

### Login Page
 
 * Page where the user can log into the website
 * Redirects the user to the main page

### Home Page

* Two variants based on if the user is signed in or not:
  * The page when the user isn't signed in doesn't allow the user to like or comment on posts, they cannot access the full experience of the website.
  * The page allows the user to open individual post pages and like when they are authenticated.
    * Users can comment on posts by opening the individual post page.
* Ability to search for for keywords and users in a search bar.
* Allows a signed in user to create posts.
* Shows a feed of posts using an infinite scroll feature where data is dynamically loaded based on if the user has any content to see, makes it so there is always new content to view.
* Implements a collaborative filtering algorithm for reccomending relevant posts to the user.
  * The algorithm for post recommendations is contained within the ./data/algo.js file. It uses a user-based collaborative filtering approach. The algorithm creates a matrix representing each user and the posts they've interacted with, along with the intensity of their interactions. Using cosine similarity, the algorithm finds users with interests similar to those of a given user. Once we identify users with similar interests to the target user, we can find posts that these similar users have engaged with, but the target user has not. Posts that similar users have interacted with, which the target user has yet to discover, are likely to be more interesting and relevant to the target user.

### Posts

* Viewing a single post shows attributes such as clothing links, keywords, likes, along with the user profile.
* Allows users to like and share posts, only available to logged in users.
* Logged in users can delete their posts when in the expanded post view.

### Search
* Entering a search term and submitting will search for a user.
* Entering a search term and pressing "," will create keyword tags for the search.

### Profiles
* Displays the profile picture, username, bio, number of followers/following, and posts of a user.
* If the user is logged in and is viewing someone elses profile they have the option to follow that user.
* If a user is viewing their own profile they can choose to edit their profile or log out.
* Only users that are logged in can see other user profiles.

### Admin
* Have access to an admin dashboard where they can view posts that have been reported.
* They have the ability to dismiss a report, remove a post, or ban a user.