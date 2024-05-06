import { posts } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { users, keywords } from "../config/mongoCollections.js";
import * as collection from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as keywordData from "./keyword.js";

/**
* Schema for Posts
{
  "_id": "ObjectId",
  "user": "ObjectId (Users)",
  "image": "string (URL)",
  "clothingLinks": ["string (URL)"],
  "keywords": ["string"],
  "likes": ["ObjectId (Users)"],
  "comments": ["ObjectId (Comments)"],
  "createdAt": "Date", 
  "interactions": [
	{
	  "user": "ObjectId (Users)",
	  "score": "number"
	}
  ], 
  "description": "string"
}
 */

/**
 * Creates a new post in the database.
 * @param {string} userID - The user id that created the post.
 * @param {string} image - The image URL of the post.
 * @param {Array<string>} clothingLinks - The links to the clothing items in the image.
 * @param {Array<string>} keywords - The keywords associated with the post.
 * @param {string} description - Description of the post
 * @returns {Object} - Returns the created object.
 */
export const createPost = async (
	userId,
	image,
	clothingLinks,
	keywords,
	description
) => {
	if (
		helper.areAllValuesNotNull([
			userId,
			image,
			clothingLinks,
			keywords,
			description,
		])
	) {
		throw "All values must be provided";
	}

	if (!helper.isOfType(image, "string")) {
		throw "Image must be of type string";
	}

	if (!helper.isOfType(description, "string")) {
		throw "Description must be of type string";
	}

	image = image.trim();
	description = description.trim();

	if (description === "") {
		throw "Description cannot be empty";
	}

	if (description.length > 256 || description.length < 5) {
		throw "Description is too long";
	}

	//TODO: Allow the post to have punctuation, but no naughty strings, so check for it
	// if (!description.match(/^[a-zA-Z0-9 ]+$/)) {
	// 	throw "Description can only contain alphanumeric characters and spaces";
	// }

	if (!ObjectId.isValid(userId)) {
		throw "Invalid ObjectID";
	}

	if (!helper.areAllValuesOfType(clothingLinks, "string")) {
		throw "All clothing links must be of type string";
	}

	if (!helper.areAllValuesOfType(keywords, "string")) {
		throw "All keywords must be of type string";
	}

	// Check if the user exists
	const userCollection = await users();
	const userObj = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (helper.isNull(userObj)) {
		throw "User does not exist";
	}
	
	// Check if the keywords exist if they do not exist create them
	const keywordCollection = await collection.keywords();
	for (let i = 0; i < keywords.length; i++) {
		let tempKeyword = keywords[i].trim().toLowerCase();
		if (tempKeyword === "") {
			throw "Keyword cannot be empty";
		}
		const keywordObj = await keywordCollection.findOne({
			keyword: tempKeyword,
		});
		if (helper.isNull(keywordObj)) {
			const keyword = await keywordData.create(
				keywords[i].trim().toLowerCase()
			);
			if (keyword === 1) {
				throw "Keyword could not be created";
			}
		}
	}

	// TODO Check that the image URLs are valid
	// if (!helper.isValidImg(image)) {
	// 	throw "Image URL is not valid";
	// }

	// Check that clothing URL is valid using a regex
	for (let i = 0; i < clothingLinks.length; i++) {
		if (!helper.isValidURL(clothingLinks[i])) {
			throw "Clothing URL is not valid";
		}
	}
	const username = userObj.username;

	const postCollection = await posts();
	keywords = keywords.map((keyword) => keyword.toLowerCase().trim());

	const newPost = {
		'username': username,
		'image': image,
		'clothingLinks': clothingLinks,
		'keywords': keywords,
		'likes': [],
		'comments': [],
		'createdAt': new Date(),
		'interactions': [],
		'description': description,
	};

	const insertInfo = await postCollection.insertOne(newPost);
	if (insertInfo.insertedCount === 0) {
		throw "Could not create post";
	}

	console.log(insertInfo)

	const postObj = await postCollection.findOne({ _id: insertInfo.insertedId });
	console.log(postObj);
	 
	// Add post to user's post
	const userUpdate = await userCollection.findOneAndUpdate(
		{ _id: new ObjectId(userId) },
		{ $push: { posts: postObj } }
	);

	if (userUpdate.modifiedCount === 0) {
		throw "Could not add post to user";
	}

	// Add post to keyword's posts and vice versa
	for (let i = 0; i < keywords.length; i++) {
		const keywordUpdate = await keywordCollection.updateOne(
			{ keyword: keywords[i].trim().toLowerCase() },
			{ $addToSet: { posts: postObj._id } }
		);
		// TODO Check if this is necessary
		// if (keywordUpdate.modifiedCount === 0) {
		// 	throw "Could not add post to keyword";
		// }
	}

	const insertedObject = await postCollection.findOne({
		_id: insertInfo.insertedId,
	});
	return insertedObject;
};

/**
 * Gets a post by its ID.
 * @param {string} id - The ID of the post.
 * @returns {Object} - Returns the post if it exists.
 */
export const getPostById = async (id) => {
	if (helper.isNull(id)) {
		throw "ID must be provided";
	}

	if (!helper.isOfType(id, "string")) {
		throw "ID must be of type string";
	}

	id = id.trim();

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();

	const post = await postCollection.findOne({ _id: new ObjectId(id) });

	if (helper.isNull(post)) {
		throw "Post does not exist";
	}

	return post;
};

export const deletePost = async (id) => {
	if (helper.isNull(id)) {
		return 1;
	}

	if (!helper.isOfType(id, "string")) {
		return 1;
	}

	id = id.trim();

	if (!ObjectId.isValid(id)) {
		return 1;
	}

	const postCollection = await posts();
	const deleteInfo = await postCollection.deleteOne({ _id: new ObjectId(id)});
	if (deleteInfo.deletedCount === 0) {
		return 1;
	}

	return 0;
};

/**
 * Retrieves all posts from the database.
 * @returns {Array} - Returns a list of all posts.
 */
export const getAllPosts = async () => {
	const postCollection = await posts();
	const postList = await postCollection.find({}).toArray();
	return postList;
};

/**
 * Retrieves all posts by a user.
 * @param {string} user - The username to retrieve posts for.
 * @returns {Array} - Returns a list of all posts by the user.
 */
export const getPostsByUser = async (user) => {
	if (helper.isNull(user)) {
		throw "User must be provided";
	}

	if (!helper.isOfType(user, "string")) {
		throw "User must be of type string";
	}

	user = user.trim();

	const postCollection = await posts();
	const postList = await postCollection.find({ user }).toArray();
	return postList;
};

/**
 * Retrieves all posts by a keyword.
 * @param {string} keyword - The keyword to retrieve posts for.
 * @returns {Array} - Returns a list of all posts by the keyword.
 */
export const getPostsByKeyword = async (keyword) => {
	if (helper.isNull(keyword)) {
		throw "Keyword must be provided";
	}

	if (!helper.isOfType(keyword, "string")) {
		throw "Keyword must be of type string";
	}

	keyword = keyword.trim();

	const postCollection = await posts();
	let postList = await postCollection.find({ "keywords": {$elemMatch: {$eq: keyword}}});
	postList = await postList.toArray();
	return postList; 
};

/**
 *
 * @param {Object} keywords Array of string keywords
 * @param {string} username The username of the user
 * @returns A list of posts from the user that contain any of the keywords.
 */
export const getPostsByKeywordsAndUser = async (keywords, username) => {
	if (helper.isNull(username)) {
		throw "User must be provided";
	}

	if (!helper.isOfType(username, "string")) {
		throw "User must be of type string";
	}

	if (helper.isNull(keywords)) {
		throw "Keywords must be provided";
	}
	if (!helper.isOfType(keywords, "string")) {
		throw "Keywords must be of type string";
	}

	username = username.trim();
	keywords = keywords.trim();
	const postCollection = await posts();
	const postList = await postCollection
		.find({ username: username, keywords: { $in: keywords } })
		.toArray();
	if (helper.isNull(postList)) {
		throw "Posts not found";
	}
	return postList;
};

/**
 * Retrieves all posts that a user has liked.
 * @param {string} user - The username to retrieve liked posts for.
 * @returns {Array} - Returns a list of all posts that the user has liked.
 */
export const getLikedPostsByUser = async (user) => {
	if (helper.isNull(user)) {
		throw "User must be provided";
	}

	if (!helper.isOfType(user, "string")) {
		throw "User must be of type string";
	}

	user = user.trim();

	const postCollection = await posts();
	const postList = await postCollection.find({ likes: user }).toArray();
	return postList;
};

/**
 * Adds a like to a post.
 * @param {string} user - The user id that liked the post.
 * @param {string} post - The post id that was liked.
 * @returns {Array} - Returns the updated likes array.
 */
export const addLike = async (user, post) => {
	if (helper.areAllValuesNotNull([user, post])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([user, post], "string")) {
		throw "All values must be of type string";
	}

	user = user.trim();
	post = post.trim();

	if (!ObjectId.isValid(user) || !ObjectId.isValid(post)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();

	// First check if the user has already liked the post
	const existingPost = await postCollection.findOne({
		_id: new ObjectId(post),
	});
	if (existingPost.likes.includes(user)) {
		throw "User has already liked the post";
	}

	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $addToSet: { likes: new ObjectId(user) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add like";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });

	// Recalculate the engagement score of the post
	await incrementEngagementScore(post, user, 3);

	return postObj;
};

/**
 * Removes a like from a post.
 * @param {string} user - The user id that unliked the post.
 * @param {string} post - The post id that was unliked.
 * @returns {number} - New number of likes on the post.
 */
export const removeLike = async (user, post) => {
	if (helper.areAllValuesNotNull([user, post])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([user, post], "string")) {
		throw "All values must be of type string";
	}

	user = user.trim();
	post = post.trim();

	if (!ObjectId.isValid(user) || !ObjectId.isValid(post)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $pull: { likes: new ObjectId(user) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not remove like";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	await incrementEngagementScore(post, user, -3);
	return postObj;
};

/**
 * Adds a keyword to a post.
 * @param {string} post - The ID of the post.
 * @param {string} keyword - The keyword ID.
 * @returns {Object} The newly added keyword.
 */
export const addKeyword = async (post, keyword) => {
	if (helper.areAllValuesNotNull([post, keyword])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([post, keyword], "string")) {
		throw "All values must be of type string";
	}

	post = post.trim();
	keyword = keyword.trim();

	if (!ObjectId.isValid(post)) {
		throw "Invalid ObjectID";
	}

	if (!ObjectId.isValid(keyword)) {
		throw "Invalid ObjectID";
	}

	// Check if the keyword exists
	const keywordCollection = await keywords();
	const keywordObj = await keywordCollection.findOne({
		_id: new ObjectId(keyword),
	});
	if (helper.isNull(keywordObj)) {
		throw "Keyword does not exist";
	}
	console.log(keywordObj);
	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $addToSet: { keywords: keywordObj.keyword } }
	);

	const newKeyword = await keywordData.getKeywordById(keyword);
	return newKeyword;
};

/**
 * Updates a post in the database.
 * @param {string} id - The ID of the post to update.
 * @param {string} image - The updated image URL for the post.
 * @param {string[]} clothingLinks - An array of updated clothing URLs for the post.
 * @param {string[]} keywords - An array of updated keywords for the post.
 * @returns {ObjectId} - Returns upsdated post object.
 */
export const updatePost = async (
	id,
	image,
	clothingLinks,
	keywords,
	description
) => {
	if (
		helper.areAllValuesNotNull([
			id,
			image,
			clothingLinks,
			keywords,
			description,
		])
	) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([id, image, description], "string")) {
		throw "All values must be of type string";
	}

	id = id.trim();
	image = image.trim();
	description = description.trim();

	if (description === "") {
		throw "Description cannot be empty";
	}

	if (description.length > 256 || description.length < 5) {
		throw "Description is too long";
	}

	if (!description.match(/^[a-zA-Z0-9 ]+$/)) {
		throw "Description can only contain alphanumeric characters and spaces";
	}

	if (!helper.areAllValuesOfType(clothingLinks, "string")) {
		throw "All values must be of type string";
	}

	if (!helper.areAllValuesOfType(keywords, "string")) {
		throw "All values must be of type string";
	}

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	// TODO Check that the image URLs are valid

	// Check that clothing URL is valid using a regex
	for (let i = 0; i < clothingLinks.length; i++) {
		if (!helper.isValidURL(clothingLinks[i])) {
			throw "Clothing URL is not valid";
		}
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { image, clothingLinks, keywords, description } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update post";
	}

	const newPost = await postCollection.findOne({ _id: new ObjectId(id) });
	return newPost;
};

export const addComment = async (post, comment) => {
	if (helper.areAllValuesNotNull([post, comment])) {
		throw "All values must be provided";
	}
	console.log(post, comment);
	if (!helper.areAllValuesOfType([post, comment], "string")) {
		throw "All values must be of type string";
	}

	post = post.trim();
	comment = comment.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(comment)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $push: { comments: new ObjectId(comment) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add comment";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj;
};

export const removeComment = async (post, comment) => {
	if (helper.areAllValuesNotNull([post, comment])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([post, comment], "string")) {
		throw "All values must be of type string";
	}

	post = post.trim();
	comment = comment.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(comment)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $pull: { comments: new ObjectId(comment) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not remove comment";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj;
};

export const createEmptyInteraction = async (post, user) => {
	if (helper.areAllValuesNotNull([post, user])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([post, user], "string")) {
		throw "All values must be of type string";
	}

	post = post.trim();
	user = user.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(user)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $push: { interactions: { user: new ObjectId(user), score: 0 } } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add interaction";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj;
};

export const incrementEngagementScore = async (post, user, num) => {
	if (helper.areAllValuesNotNull([post, user, num])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([post, user], "string")) {
		throw "All values must be of type string";
	}

	if (!helper.isOfType(num, "number")) {
		throw "Score must be of type number";
	}

	post = post.trim();
	user = user.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(user)) {
		throw "Invalid ObjectID";
	}

	// check if the interaction exists
	const postCollection = await posts();
	const interaction = await postCollection.findOne({
		_id: new ObjectId(post),
		"interactions.user": new ObjectId(user),
	});

	if (helper.isNull(interaction)) {
		await createEmptyInteraction(post, user);
	}

	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post), "interactions.user": new ObjectId(user) },
		{ $inc: { "interactions.$.score": num } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not increment interaction";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj;
};

export const addInteraction = async (post, user, score) => {
	if (helper.areAllValuesNotNull([post, user, score])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([post, user], "string")) {
		throw "All values must be of type string";
	}

	if (!helper.isOfType(score, "number")) {
		throw "Score must be of type number";
	}

	post = post.trim();
	user = user.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(user)) {
		throw "Invalid ObjectID";
	}

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $push: { interactions: { user: new ObjectId(user), score } } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add interaction";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj;
};

export default {
	createPost,
	getPostById,
	deletePost,
	getAllPosts,
	getPostsByUser,
	getPostsByKeyword,
	getLikedPostsByUser,
	addLike,
	removeLike,
	addKeyword,
	updatePost,
	addComment,
	removeComment,
	addInteraction,
	incrementEngagementScore,
	createEmptyInteraction,
};
