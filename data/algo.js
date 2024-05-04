import { getAllPosts } from "./posts.js";

const createInteractionMatrix = async () => {
	const posts = await getAllPosts();
	console.log("posts", posts);
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
	const similarUsers = Object.entries(userSimilarities[userId])
		.sort(function (a, b) {
			return b[1] - a[1];
		})
		.slice(0, 5); // Top 5 similar users
	console.log("similarUsers", similarUsers);
	const recommendedPosts = new Set();

	similarUsers.forEach(function ([similarUserId]) {
		const posts = matrix[similarUserId];
		for (const postId in posts) {
			if (!matrix[userId].hasOwnProperty(postId)) {
				// Add unique posts not interacted with by the target user
				recommendedPosts.add(postId);
			}
		}
	});

	return [...recommendedPosts];
};

/**
 * Retrieves recommended posts for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} The recommended posts for the user.
 */
export const getRecommendedPosts = async (userId) => {

	const matrix = await createInteractionMatrix();
	// console.log('matrix', matrix);
	const similarities = await createSimilarityMatrix(matrix);
	// console.log('similarities', similarities);
	const recommendedPosts = await getTopMatches(userId, similarities, matrix);

	return recommendedPosts;
};

export const calculateEngagementScore = async (
	userObj,
	postObj,
	links_clicked
) => {
	const postKeys = postObj.keywords;
	const userLikedKeywords = userObj.keywords;
	const postComments = postObj.comments;
	console.log("postComments", userObj);
	const userComments = [];
	for (let i = 0; i < postComments.length; i++) {
		const comment = postComments[i];
		if (comment.user === userObj._id) {
			userComments.push(comment);
		}
	}
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
export default { getRecommendedPosts, calculateEngagementScore }
