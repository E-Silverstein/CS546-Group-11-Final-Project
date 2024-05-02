/*
Populate data and test
*/

import { dbConnection, closeConnection } from ".././config/mongoConnections.js";
import { userData, postData, commentData, keywordData } from "../data/index.js";
import { getRecommendedPosts } from "../data/algo.js";

import bycrypt from "bcrypt";

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();
	let passwords = [
		"password1",
		"password2",
		"password3",
		"password4",
		"password5",
		"password6",
		"password7",
		"password8",
		"password9",
		"password10",
		"password11",
		"password12",
		"password13",
		"password14",
		"password15",
	];
	let hashedPasswords = [];
	for (let i = 0; i < passwords.length; i++) {
		hashedPasswords.push(await bycrypt.hash(passwords[i], 8));
	}
	// console.log(hashedPasswords);
	// Create users
    const user1 = await userData.createUser(
        "user1",
        hashedPasswords[0],
        "profile1",
        20,
        "This is user 1's bio."
    );
    const user2 = await userData.createUser(
        "user2",
        hashedPasswords[1],
        "profile2",
        21,
        "This is user 2's bio."
    );
    const user3 = await userData.createUser(
        "user3",
        hashedPasswords[2],
        "profile3",
        22,
        "This is user 3's bio."
    );
    const user4 = await userData.createUser(
        "user4",
        hashedPasswords[3],
        "profile4",
        23,
        "This is user 4's bio."
    );
    const user5 = await userData.createUser(
        "user5",
        hashedPasswords[4],
        "profile5",
        24,
        "This is user 5's bio."
    );
    const user6 = await userData.createUser(
        "user6",
        hashedPasswords[5],
        "profile6",
        25,
        "This is user 6's bio."
    );
    const user7 = await userData.createUser(
        "user7",
        hashedPasswords[6],
        "profile7",
        26,
        "This is user 7's bio."
    );
    const user8 = await userData.createUser(
        "user8",
        hashedPasswords[7],
        "profile8",
        27,
        "This is user 8's bio."
    );
    const user9 = await userData.createUser(
        "user9",
        hashedPasswords[8],
        "profile9",
        28,
        "This is user 9's bio."
    );
    const user10 = await userData.createUser(
        "user10",
        hashedPasswords[9],
        "profile10",
        29,
        "This is user 10's bio."
    );
    const user11 = await userData.createUser(
        "user11",
        hashedPasswords[10],
        "profile11",
        30,
        "This is user 11's bio."
    );
    const user12 = await userData.createUser(
        "user12",
        hashedPasswords[11],
        "profile12",
        31,
        "This is user 12's bio."
    );
    const user13 = await userData.createUser(
        "user13",
        hashedPasswords[12],
        "profile13",
        32,
        "This is user 13's bio."
    );
    const user14 = await userData.createUser(
        "user14",
        hashedPasswords[13],
        "profile14",
        33,
        "This is user 14's bio."
    );
    const user15 = await userData.createUser(
        "user15",
        hashedPasswords[14],
        "profile15",
        34,
        "This is user 15's bio."
    );
	console.log(user1);

	// Create posts
	const post1 = await postData.create(
		user1._id,
		"image.png",
		["https://github.com/"],
		["keyword1", "keyword2"]
	);
	const post2 = await postData.create(
		user2._id,
		"image.png",
		["https://github.com/"],
		["keyword2", "keyword3"]
	);
	const post3 = await postData.create(
		user3._id,
		"image.png",
		["https://github.com/"],
		["keyword3", "keyword4"]
	);
	const post4 = await postData.create(
		user4._id,
		"image.png",
		["https://github.com/"],
		["keyword4", "keyword5"]
	);
	const post5 = await postData.create(
		user5._id,
		"image.png",
		["https://github.com/"],
		["keyword5", "keyword1"]
	);
	const post6 = await postData.create(
		user6._id,
		"image.png",
		["https://github.com/"],
		["keyword6", "keyword7"]
	);
	const post7 = await postData.create(
		user7._id,
		"image.png",
		["https://github.com/"],
		["keyword7", "keyword8"]
	);
	const post8 = await postData.create(
		user8._id,
		"image.png",
		["https://github.com/"],
		["keyword8", "keyword9"]
	);
	const post9 = await postData.create(
		user9._id,
		"image.png",
		["https://github.com/"],
		["keyword9", "keyword10"]
	);
	const post10 = await postData.create(
		user10._id,
		"image.png",
		["https://github.com/"],
		["keyword10", "keyword11"]
	);
	const post11 = await postData.create(
		user11._id,
		"image.png",
		["https://github.com/"],
		["keyword11", "keyword12"]
	);
	const post12 = await postData.create(
		user12._id,
		"image.png",
		["https://github.com/"],
		["keyword12", "keyword13"]
	);
	const post13 = await postData.create(
		user13._id,
		"image.png",
		["https://github.com/"],
		["keyword13", "keyword14"]
	);
	const post14 = await postData.create(
		user14._id,
		"image.png",
		["https://github.com/"],
		["keyword14", "keyword15"]
	);
	const post15 = await postData.create(
		user15._id,
		"image.png",
		["https://github.com/"],
		["keyword15", "keyword6"]
	);
	console.log(post1);

	// Create comments
	const comment1 = await commentData.create(post1._id, user1._id, "comment1");
	const comment2 = await commentData.create(post2._id, user2._id, "comment2");
	const comment3 = await commentData.create(post3._id, user3._id, "comment3");
	const comment4 = await commentData.create(post4._id, user4._id, "comment4");
	const comment5 = await commentData.create(post5._id, user5._id, "comment5");
	console.log("comment1", comment1);
	// Create keywords
	// const keyword1 = await keywordData.create('keyword1');
	// const keyword2 = await keywordData.create('keyword2');
	// const keyword3 = await keywordData.create('keyword3');
	// const keyword4 = await keywordData.create('keyword4');
	// const keyword5 = await keywordData.create('keyword5');
	// console.log('keyword1', keyword1);

	// Add keywords to posts
	// await postData.addKeyword(post1._id.toString(), keyword1._id.toString());
	// await postData.addKeyword(post2._id.toString(), keyword2._id.toString());
	// await postData.addKeyword(post3._id.toString(), keyword3._id.toString());
	// await postData.addKeyword(post4._id.toString(), keyword4._id.toString());
	// await postData.addKeyword(post5._id.toString(), keyword5._id.toString());
	// console.log(post2);

	await postData.addLike(user1._id.toString(), post2._id.toString());
	await postData.addLike(user2._id.toString(), post2._id.toString());
	await postData.addLike(user3._id.toString(), post2._id.toString());
	await postData.addLike(user4._id.toString(), post2._id.toString());
	await postData.addLike(user5._id.toString(), post2._id.toString());

	await postData.addLike(user1._id.toString(), post3._id.toString());
	await postData.addLike(user2._id.toString(), post3._id.toString());

	await postData.addInteraction(post1._id.toString(), user1._id.toString(), 10);
	await postData.addInteraction(post2._id.toString(), user1._id.toString(), 10);
	await postData.addInteraction(post3._id.toString(), user1._id.toString(), 10);

	await postData.addInteraction(post2._id.toString(), user2._id.toString(), 7);
	await postData.addInteraction(post3._id.toString(), user2._id.toString(), 7);

	await postData.addInteraction(post3._id.toString(), user3._id.toString(), 10);

	await postData.addInteraction(post4._id.toString(), user4._id.toString(), 8);

	await postData.addInteraction(post5._id.toString(), user5._id.toString(), 9);

	await postData.addInteraction(post6._id.toString(), user6._id.toString(), 7);

	await postData.addInteraction(post7._id.toString(), user7._id.toString(), 7);

	await postData.addInteraction(post8._id.toString(), user8._id.toString(), 6);

	await postData.addInteraction(post9._id.toString(), user9._id.toString(), 5);

	await postData.addInteraction(post10._id.toString(), user10._id.toString(), 5);

	await postData.addInteraction(post11._id.toString(), user11._id.toString(), 5);

	await postData.addInteraction(post12._id.toString(), user12._id.toString(), 6);

	await postData.addInteraction(post13._id.toString(), user13._id.toString(), 7);

	await postData.addInteraction(post14._id.toString(), user14._id.toString(), 6);

	await postData.addInteraction(post15._id.toString(), user15._id.toString(), 7);

	const recommendedPosts = await getRecommendedPosts(user1._id.toString());
	console.log("rec posts", recommendedPosts);

	// const removingLike = await posts.removeLike(user1._id.toString(),post2._id.toString());
	// console.log('likes', removingLike.likes);

	// const addingKeyword = await posts.addKeyword(post2._id.toString(), keyword1._id.toString());
	// console.log('keywords', addingKeyword.keywords);

	// const addngComment = await posts.addComment(post2._id.toString(), comment1._id.toString());
	// console.log('comments', addngComment.comments);

	await closeConnection();
}

await main();
