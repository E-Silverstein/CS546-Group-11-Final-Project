import { getAllPosts, getPostById } from "./posts.js";
import { getUserById } from "./users.js";
import { getCommentById } from "./comments.js";
import { createEmptyInteraction } from "./posts.js";
import { ObjectId } from "mongodb";
import { posts, comments } from "../config/mongoCollections.js";

const createInteractionMatrix = async () => {
	const posts = await getAllPosts();
	// console.log("posts", posts);
	const userPostMatrix = {};
	posts.forEach((post) => {
		const postId = post._id;
		const interactions = post.interactions;

		interactions.forEach(function (interaction) {
			const userId = interaction.user;
			const score = interaction.score;

			if (!userPostMatrix[userId]) {
				userPostMatrix[userId] = {};
			}
			userPostMatrix[userId][postId] = score;
		});
	});
	return userPostMatrix;
};

const cosineSimilarity = (user1, user2) => {
	const commonKeys = Object.keys(user1).filter(function (key) {
		return user2.hasOwnProperty(key);
	});

	if (commonKeys.length === 0) {
		return 0; // No common interactions
	}

	const dotProduct = commonKeys.reduce(function (acc, key) {
		return acc + user1[key] * user2[key];
	}, 0);

	const magnitude1 = Math.sqrt(
		Object.values(user1).reduce(function (acc, value) {
			return acc + value * value;
		}, 0)
	);

	const magnitude2 = Math.sqrt(
		Object.values(user2).reduce(function (acc, value) {
			return acc + value * value;
		}, 0)
	);

	if (magnitude1 === 0 || magnitude2 === 0) {
		return 0;
	}

	return dotProduct / (magnitude1 * magnitude2); // Cosine similarity formula
};

const createSimilarityMatrix = async (matrix) => {
	const userIds = Object.keys(matrix);
	const userSimilarities = {};

	userIds.forEach(function (userId1) {
		userSimilarities[userId1] = {};
		userIds.forEach(async function (userId2) {
			if (userId1 !== userId2) {
				userSimilarities[userId1][userId2] = await cosineSimilarity(
					matrix[userId1],
					matrix[userId2]
				);
			}
		});
	});

	return userSimilarities;
};

const getTopMatches = async (userId, userSimilarities, matrix) => {
	const recommendedPosts = new Set();
	let similarUsers = [];
	if (userSimilarities && userSimilarities[userId]) {
		similarUsers = Object.entries(userSimilarities[userId])
			.sort(function (a, b) {
				return b[1] - a[1];
			})
			.slice(0, 5); // Top 5 similar users
	} else {
		// get 5 random posts from the database when no similar users are found (cold start problem)
		const allPosts = await posts();
		const randomPosts = await allPosts
			.aggregate([
				{ $match: { "user._id": { $ne: userId } } },
				{ $sample: { size: 5 } },
			])
			.toArray();
		// console.log("randomPosts", randomPosts);
		return randomPosts;
	}
	similarUsers.forEach(async function ([similarUserId]) {
		const postSim = matrix[similarUserId];
		for (const postId in postSim) {
			if (!matrix[userId].hasOwnProperty(postId)) {
				// Add unique posts not interacted with by the target user
				recommendedPosts.add(postId);
				// Create an empty interaction for the user to avoid recommending the same post again
				await createEmptyInteraction(postId.toString(), userId.toString());
			}
		}
	});

	const reccomendedPostsIds = [...recommendedPosts];
	const reccomendedPostsObjs = [];
	// console.log("reccomendedPostsIds");
	for (let i = 0; i < reccomendedPostsIds.length; i++) {
		// console.log("start loop");
		if (reccomendedPostsObjs.length >= 5) {
			return reccomendedPostsObjs;
		}
		const post = await getPostById(reccomendedPostsIds[i]);
		reccomendedPostsObjs.push(post);
	}

	return reccomendedPostsObjs;
};

/**
 * Retrieves recommended posts for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} The recommended posts for the user.
 */
export const getRecommendedPosts = async (userId) => {
	// console.log("userId", userId);
	const userObj = await getUserById(userId);
	if (!userObj) {
		throw "User not found";
	}
	const matrix = await createInteractionMatrix();
	const similarities = await createSimilarityMatrix(matrix);
	const recommendedPosts = await getTopMatches(userId, similarities, matrix);

	let out = [];
	const commentCollection = await comments();
	for (let i = 0; i < recommendedPosts.length; i++) {
		let outputComments = [];
		for (let j = 0; j < recommendedPosts[i].comments.length; j++) {
			let comment = await commentCollection.findOne({
				_id: new ObjectId(recommendedPosts[i].comments[j]),
			});
			let username = await getUserById(comment.user.toString());
			outputComments.push({
				user: username.username,
				text: comment.text,
			});
		}
		let outPost = {
			username: recommendedPosts[i].username,
			image: recommendedPosts[i].image,
			clothingLinks: recommendedPosts[i].clothingLinks,
			description: recommendedPosts[i].description,
			likes: recommendedPosts[i].likes.length,
			comments: outputComments,
			keywords: recommendedPosts[i].keywords,
		};
		out.push(outPost);
	}
	console.log("out", out);
	return out;
};

export const calculateEngagementScore = async (userObj, postObj) => {
	const postComments = postObj.comments;
	const userComments = [];
	for (let i = 0; i < postComments.length; i++) {
		const comment = postComments[i];
		if (comment.user === userObj._id) {
			userComments.push(comment);
		}
	}

	const postKeys = postObj.keywords;
	const userLikedKeywords = userObj.keywords;
	const matchingKeywords = [];
	for (let i = 0; i < postKeys.length; i++) {
		const key = postKeys[i];
		if (userLikedKeywords.indexOf(key) !== -1) {
			matchingKeywords.push(key);
		}
	}

	const isFollowingUser = userObj.following.includes(postObj.user._id);
	return (
		matchingKeywords.length +
		isFollowingUser * 5 +
		links_clicked +
		userComments * 2
	);
};

export const getRandomPosts = async () => {
	const allPosts = await posts();
	const recommendedPosts = await allPosts
		.aggregate([{ $sample: { size: 5 } }])
		.toArray();
	
		let out = [];
		const commentCollection = await comments();
		for (let i = 0; i < recommendedPosts.length; i++) {
			let outputComments = [];
			for (let j = 0; j < recommendedPosts[i].comments.length; j++) {
				let comment = await commentCollection.findOne({
					_id: new ObjectId(recommendedPosts[i].comments[j]),
				});
				let username = await getUserById(comment.user.toString());
				outputComments.push({
					user: username.username,
					text: comment.text,
				});
			}
			//console.log(recommendedPosts[i]._id.toString());
			let outPost = {
				id : recommendedPosts[i]._id.toString(),
				username: recommendedPosts[i].username,
				image: recommendedPosts[i].image,
				clothingLinks: recommendedPosts[i].clothingLinks,
				description: recommendedPosts[i].description,
				likes: recommendedPosts[i].likes.length || 0,
				comments: outputComments,
				keywords: recommendedPosts[i].keywords,
			};
			out.push(outPost);
		}
		return out;
	
};

export default {
	getRecommendedPosts,
	calculateEngagementScore,
	getRandomPosts,
};
