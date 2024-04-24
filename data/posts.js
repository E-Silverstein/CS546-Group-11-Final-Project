import { posts } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { users, keywords } from "../config/mongoCollections.js";
import * as collection from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

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
  "createdAt": "Date"
}
 */

/**
 * Creates a new post in the database.
 * @param {string} user - The user that created the post.
 * @param {string} image - The image URL of the post.
 * @param {Array<string>} clothingLinks - The links to the clothing items in the image.
 * @param {Array<string>} keywords - The keywords associated with the post.
 * @returns {Object} - Returns the created object.
 */
export const create = async (user, image, clothingLinks, keywords) => {
	if (helper.areAllValuesNotNull([user, image, clothingLinks, keywords])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([user, image], "string")) {
		throw "All values must be of type string";
	}

	user = user.trim();
	image = image.trim();

	if (!helper.areAllValuesOfType(clothingLinks, "string")) {
		throw "All values must be of type string";
	}

	if (!helper.areAllValuesOfType(keywords, "string")) {
		throw "All values must be of type string";
	}

	// Check if the user exists
	const userCollection = await users();
	const userObj = await userCollection.findOne({ username: user });
	if (helper.isNull(userObj)) {
		throw "User does not exist";
	}

	// Check if the keywords exist if they do not exist create them
	const keywordCollection = await collection.keywords();
	for (let i = 0; i < keywords.length; i++) {
		const keywordObj = await keywordCollection.findOne({
			keyword: keywords[i],
		});
		if (helper.isNull(keywordObj)) {
			const keyword = await create(keywords[i]);
			if (keyword === 1) {
				throw "Keyword could not be created";
			}
		}
	}

	// TODO Check that the image URLs are valid

	// Check that clothing URL is valid using a regex
	for (let i = 0; i < clothingLinks.length; i++) {
		if (!helper.isValidURL(clothingLinks[i])) {
			throw "Clothing URL is not valid";
		}
	}

	const postCollection = await posts();
	const newPost = {
		user,
		image,
		clothingLinks,
		keywords,
		likes: [],
		comments: [],
		createdAt: new Date(),
	};

	const insertInfo = await postCollection.insertOne(newPost);
	if (insertInfo.insertedCount === 0) {
		throw "Could not create post";
	}

	// Add post to user's posts
	const userUpdate = await userCollection.updateOne(
		{ username: user },
		{ $push: { posts: insertInfo.insertedId.toString() } }
	);
	if (userUpdate.modifiedCount === 0) {
		throw "Could not add post to user";
	}
	// Add keywords to keyword's posts
	for (let i = 0; i < keywords.length; i++) {
		const keywordUpdate = await keywordCollection.updateOne(
			{ keyword: keywords[i] },
			{ $push: { posts: insertInfo.insertedId.toString() } }
		);
		if (keywordUpdate.modifiedCount === 0) {
			throw "Could not add post to keyword";
		}
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
	const post = await postCollection.findOne({ _id: id });
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
	const deleteInfo = await postCollection.deleteOne({ _id: id });
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
	const postList = await postCollection.find({ keywords: keyword }).toArray();
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
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $push: { likes: new ObjectId(user) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add like";
	}
	const postObj = await postCollection.findOne({ _id: new ObjectId(post) });
	return postObj.likes.length;
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
	return postObj.likes.length;
};

/**
 * Adds a keyword to a post.
 * @param {string} post - The ID of the post.
 * @param {string} keyword - The ID of the keyword.
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

	const postCollection = await posts();
	const updateInfo = await postCollection.updateOne(
		{ _id: new ObjectId(post) },
		{ $push: { keywords: new ObjectId(keyword) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not add keyword";
	}
	const newKeyword = await keywords.getKeywordById(keyword);
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
export const updatePost = async (id, image, clothingLinks, keywords) => {
	if (helper.areAllValuesNotNull([id, image, clothingLinks, keywords])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([id, image], "string")) {
		throw "All values must be of type string";
	}

	id = id.trim();
	image = image.trim();

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
		{ $set: { image, clothingLinks, keywords } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update post";
	}

	const newPost = await postCollection.findOne({ _id: new ObjectId(id) });
	return newPost;
};
