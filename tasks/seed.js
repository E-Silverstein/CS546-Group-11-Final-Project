/*
Populate data and test
*/

import { dbConnection, closeConnection } from '.././config/mongoConnections.js';
import * as users from '../data/users.js';
import * as posts from '../data/posts.js';
import * as comments from '../data/comments.js';
import * as keywords from '../data/keyword.js';

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    // Create users
    const user1 = await users.create('user1', 'password1', 'profile1', 20, new Date());
    const user2 = await users.create('user2', 'password2', 'profile2', 21, new Date());
    const user3 = await users.create('user3', 'password3', 'profile3', 22, new Date());
    const user4 = await users.create('user4', 'password4', 'profile4', 23, new Date());
    const user5 = await users.create('user5', 'password5', 'profile5', 24, new Date());

    const user1Id = await users.getUserByUsername('user1');
    const user2Id = await users.getUserByUsername('user2');
    const user3Id = await users.getUserByUsername('user3');
    const user4Id = await users.getUserByUsername('user4');
    const user5Id = await users.getUserByUsername('user5');
    
    // Create posts
    const post1 = await posts.create('user1', 'image.png', ['https://github.com/'], ['keyword1']);
    const post2 = await posts.create('user2', 'image.png', ['https://github.com/'], ['keyword2']);
    const post3 = await posts.create('user3', 'image.png', ['https://github.com/'], ['keyword3']);
    const post4 = await posts.create('user4', 'image.png', ['https://github.com/'], ['keyword4']);  
    const post5 = await posts.create('user5', 'image.png', ['https://github.com/'], ['keyword5']);
    const post6 = await posts.create('user1', 'image.png', ['https://github.com/'], ['keyword1']);
    const post7 = await posts.create('user2', 'image.png', ['https://github.com/'], ['keyword2']);
    const post8 = await posts.create('user3', 'image.png', ['https://github.com/'], ['keyword3']);
    const post9 = await posts.create('user4', 'image.png', ['https://github.com/'], ['keyword4']);
    const post10 = await posts.create('user5', 'image.png', ['https://github.com/'], ['keyword5']);
   
    // Create comments
    const comment1 = await comments.create(post1, user1Id, 'comment1');
    const comment2 = await comments.create(post2, user2Id, 'comment2');
    const comment3 = await comments.create(post3, user3Id, 'comment3');
    const comment4 = await comments.create(post4, user4Id, 'comment4');
    const comment5 = await comments.create(post5, user5Id, 'comment5');

    // Create keywords
    const keyword1 = await keywords.create('keyword1');
    const keyword2 = await keywords.create('keyword2');
    const keyword3 = await keywords.create('keyword3');
    const keyword4 = await keywords.create('keyword4');
    const keyword5 = await keywords.create('keyword5');

    // Add keywords to posts
    await posts.addKeyword(post1, keyword1);
    await posts.addKeyword(post2, keyword2);
    await posts.addKeyword(post3, keyword3);
    await posts.addKeyword(post4, keyword4);
    await posts.addKeyword(post5, keyword5);
    await posts.addKeyword(post6, keyword1);
    await posts.addKeyword(post7, keyword2);
    await posts.addKeyword(post8, keyword3);
    await posts.addKeyword(post9, keyword4);
    await posts.addKeyword(post10, keyword5);

    await closeConnection();
};




await main();
