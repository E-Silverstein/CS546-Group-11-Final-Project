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

## Features

### Post Recommendation Algorithm

The algorithm for post recommendations is contained within the ./data/algo.js file. It uses a user-based collaborative filtering approach. The algorithm creates a matrix representing each user and the posts they've interacted with, along with the intensity of their interactions. Using cosine similarity, the algorithm finds users with interests similar to those of a given user. Once we identify users with similar interests to the target user, we can find posts that these similar users have engaged with, but the target user has not. Posts that similar users have interacted with, which the target user has yet to discover, are likely to be more interesting and relevant to the target user.
