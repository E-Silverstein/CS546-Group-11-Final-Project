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
    console.log(user1);
    // Create posts
    const post1 = await posts.create(user1._id, 'image.png', ['https://github.com/'], ['keyword1']);
    const post2 = await posts.create(user2._id, 'image.png', ['https://github.com/'], ['keyword2']);
    const post3 = await posts.create(user3._id, 'image.png', ['https://github.com/'], ['keyword3']);
    const post4 = await posts.create(user4._id, 'image.png', ['https://github.com/'], ['keyword4']);  
    const post5 = await posts.create(user5._id, 'image.png', ['https://github.com/'], ['keyword5']);
    console.log(post1);
    // Create comments
    const comment1 = await comments.create(post1._id, user1._id, 'comment1');
    const comment2 = await comments.create(post2._id, user2._id, 'comment2');
    const comment3 = await comments.create(post3._id, user3._id, 'comment3');
    const comment4 = await comments.create(post4._id, user4._id, 'comment4');
    const comment5 = await comments.create(post5._id, user5._id, 'comment5');
    console.log('comment1', comment1);
    // Create keywords
    const keyword1 = await keywords.create('keyword1');
    const keyword2 = await keywords.create('keyword2');
    const keyword3 = await keywords.create('keyword3');
    const keyword4 = await keywords.create('keyword4');
    const keyword5 = await keywords.create('keyword5');
    console.log('keyword1', keyword1);

    // Add keywords to posts
    await posts.addKeyword(post1._id.toString(), keyword1._id.toString());
    await posts.addKeyword(post2._id.toString(), keyword2._id.toString());
    await posts.addKeyword(post3._id.toString(), keyword3._id.toString());
    await posts.addKeyword(post4._id.toString(), keyword4._id.toString());
    await posts.addKeyword(post5._id.toString(), keyword5._id.toString());
    console.log(post2);

    const updatedPost = await posts.addLike(user1._id.toString(),post2._id.toString());
    console.log('likes', updatedPost.likes);

    const removingLike = await posts.removeLike(user1._id.toString(),post2._id.toString());
    console.log('likes', removingLike.likes);

    const addingKeyword = await posts.addKeyword(post2._id.toString(), keyword1._id.toString());
    console.log('keywords', addingKeyword.keywords);

    const addngComment = await posts.addComment(post2._id.toString(), comment1._id.toString());
    console.log('comments', addngComment.comments);

    await closeConnection();
};

await main();
