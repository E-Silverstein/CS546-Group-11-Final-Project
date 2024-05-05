import { users, comments, posts, reports } from "../config/mongoCollections.js";
import {
	areAllValuesNotNull,
	areAllValuesOfType,
	isNull,
	isOfType,
} from "../helpers.js";
import { ObjectId } from "mongodb";
import { commentData } from "./index.js";
import bcrypt from 'bcrypt';

/* Schema for User
{
  "_id": "ObjectId",
  "username": "string",
  "password: "string",
  "profilePicture": "string (URL)",
  "age": "number",
  "createdAt": "Date",
  "followers": ["ObjectId (Users)"],
  "following": ["ObjectId (Users)"],
  "posts": ["ObjectId (Posts)"],
  "bio": "string", 
  "likedKeywords": ["ObjectId (Keywords)"],
  ]
}
*/

/**
 * Creates a user in the users collection
 * @param {string} username
 * @param {string} password
 * @param {string} profilePicURL
 * @param {number} age
 * @param {string} bio
 */
export const createUser = async (username, password, profilePicURL, age, bio) => {
	if (areAllValuesNotNull([username, password, profilePicURL, age, bio])) {
		throw "All values must be provided";
	}
	
	if (!areAllValuesOfType([username, password, profilePicURL, bio], "string")) {
		throw "All values must be of type string";
	}

	username = username.trim();
	password = password.trim();
	profilePicURL = profilePicURL.trim();
	bio = bio.trim();

	if (!isOfType(age, "number")) {
		throw "Age must be of type number";
	}

	if (age < 13) {
		throw "User must be at least 13 years old in order to use this application";
	}

	// Validate the username constraints
	if (username.length < 5 || username.length > 20) {
		throw "Username must be between 5 and 20 characters long";
	}

	// Check if the username contains spaces
	if (username.match(" ") !== null) {
		throw "Username cannot contain spaces";
	}

	// Make sure the username is only contains alphanumeric characters
	if (!username.match(/^[0-9a-zA-Z]+$/)) {
		throw "Username can only contain alphanumeric characters";
	}

	// Validate the password constraints
	if (password.length < 8 || password.length > 32) {
		throw "Password must be at least 8 characters long";
	}

	if (password.match(/[0-9]/g) === null) {
		throw "Password must contain at least one number";
	}

	if (password.match(/[A-Z]/g) === null) {
		throw "Password must contain at least one uppercase character";
	}

	if (password.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g) === null) {
		throw "Password must contain at least one special character";
	}

	// Check if the password contains spaces
	if (password.match(" ") !== null) {
		throw "Password cannot contain spaces";
	}

	//TODO: Fix alphanumeric for password
  // Make sure the password is only contains alphanumeric characters
	// if (!password.match(/^[0-9a-zA-Z]+$/)) {
	// 	throw "Password can only contain alphanumeric characters";
	// }

	// Hash the password
	password = await bcrypt.hash(password, 12);

	// Check if a user with a matching username already exists
	const searchUserCollection = await users();
	const searchUser = await searchUserCollection.findOne({ username: username });
	if (!isNull(searchUser)) {
		throw "User with that username already exists";
	}

	const createdAt = new Date();

	// TODO check valid profilePicURL
	if isValidImg(profilePicURL) {
		throw "Invalid image URL";
	}

	const newUser = {
		username: username,
		password: password,
		profilePicture: profilePicURL,
		age: age,
		createdAt: createdAt,
		followers: [],
		following: [],
		posts: [],
		bio: bio,
		likedKeywords: [],
	};

	const userCollection = await users();
	const insertInfo = await userCollection.insertOne(newUser);
	if (insertInfo.insertedCount === 0) {
		throw "Could not create user";
	}

	const insertedUser = await userCollection.findOne({
		_id: insertInfo.insertedId,
	});

	await userCollection.createIndex({ username: "text" });

	return insertedUser;
};

/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {Object} - Returns the user object.
 */
export const getUserById = async (id) => {
	if (isNull(id)) {
		throw "ID must be provided";
	}

	if (!isOfType(id, "string")) {
		throw "ID must be of type string";
	}

	id = id.trim();

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (isNull(user)) {
		throw "User not found";
	}

	return user;
};

/**
 * Deletes a user from the database.
 * @param {string} id - The ID of the user to be deleted.
 * @returns {boolean} - Returns true if the user is successfully deleted.
 */
export const deleteUser = async (id) => {

	console.log("delete function")
	if (isNull(id)) {
		throw "ID must be provided";
	}

	if (!isOfType(id, "string")) {
		throw "ID must be of type string";
	}

	id = id.trim();

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();

	// TODO delete user from all posts, comments, reports, followers and following lists, and delete their posts
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (isNull(user)) {
		throw "User not found";
	}

	// Delete user from all followers' following lists
	const following = await userCollection.find({ followers: new ObjectId(id) }).toArray();
	for (let i = 0; i < following.length; i++) {
		const updateFollowers = await userCollection.updateOne(
			{ _id: following[i]._id },
			{ $pull: { following: new ObjectId(id) } }
		);
		if (updateFollowers.modifiedCount === 0) {
			throw "Could not update user";
		}
	}

	// Delete user from all following users' followers lists
	const followers = await userCollection.find({ following: new ObjectId(id) }).toArray();
	for (let i = 0; i < followers.length; i++) {
		const updateFollowing = await userCollection.updateOne(
			{ _id: followers[i]._id },
			{ $pull: { followers: new ObjectId(id) } }
		);
		if (updateFollowing.modifiedCount === 0) {
			throw "Could not update user";
		}
	}

	// Delete user from all posts
	const postCollection = await posts();
	const userPosts = await postCollection.find({ user: new ObjectId(id) }).toArray();
	for (let i = 0; i < userPosts.length; i++) {
		const deletedPost = await postCollection.deleteOne({ _id: userPosts[i]._id });
		if (!deletedPost) {
			throw "Could not delete post";
		}
	}

	// Delete user from all comments
	let userId = user._id.toString();
	const commentCollection = await comments();
	const retrivedComments = await commentCollection.find({ user: userId }).toArray();
	for (let i = 0; i < retrivedComments.length; i++) {
		const deletedComment = await commentData.deleteComment(comments[i]._id.toString());
		if (!deletedComment) {
			throw "Could not delete comment";
		}
	}

	// TODO update this once the reporting funcitonality is implemented
	// Delete user from all reports 
	// const reportCollection = await reports();
	// const updateReports = await reportCollection.updateMany(
	// 	{ _id: { $in: user.reports } },
	// 	{ $pull: { author: new ObjectId(id) } }
	// );

	// Delete user
	const deleteInfo = await userCollection.deleteOne({ _id: new ObjectId(id) });

	if (deleteInfo.deletedCount === 0) {
		throw "Could not delete user";
	}

	return true;
};

/**
 * Retrieves a user's ID by their username.
 * @param {string} username - The username of the user.
 * @returns {string} The ID of the user.
 */
export const getUserByUsername = async (username) => {
	if (isNull(username)) {
		throw "Username must be provided";
	}

	if (!isOfType(username, "string")) {
		throw "Username must be of type string";
	}

	username = username.trim();

	const userCollection = await users();
	const user = await userCollection.findOne({ "username": username });
	if (isNull(user)) {
		throw "User not found";
	}

	return user._id.toString();
};

/**
 * Searches the users collection for users with a matching username.
 * @param {string} username 
 * @returns {Object} - Returns the list of user objects.
 */
export const searchUserByUsername = async (username) => {
	if (isNull(username)) {
		throw "Username must be provided";
	}

	if (!isOfType(username, "string")) {
		throw "Username must be of type string";
	}

	username = username.trim();

	const userCollection = await users();
	const users = await userCollection.find({ $text: { $search: username } }).toArray();
	if (isNull(users)) {
		throw "Users not found";
	}

	return users;
}

/**
 * Retrieves all users from the database.
 * @returns {Array} - Returns an array of user objects.
 */
export const getAllUsers = async () => {
	const userCollection = await users();
	const userList = await userCollection.find({}).toArray();
	return userList;
};

/**
 * Sets the admin status of a user.
 *
 * @param {string} id - The ID of the user.
 * @param {boolean} isAdmin - The admin status to set.
 * @returns {Object} The updated user object.
 */
export const setAdminStatus = async (id, isAdmin) => {
	if (isNull(id) || isNull(isAdmin)) {
		throw "All values must be provided";
	}

	if (!isOfType(id, "string") || !isOfType(isAdmin, "boolean")) {
		throw "All values must be of correct type";
	}

	id = id.trim();

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();
	const updateInfo = await userCollection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { isAdmin: isAdmin } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update user";
	}

	const updatedUser = await userCollection.findOne({ _id: new ObjectId(id) });
	return updatedUser;
};

/**
 * Adds a follower to a user's followers list.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} followerId - The ID of the follower.
 * @returns {Object} The updated user object.
 */
export const addFollower = async (userId, followerId) => {
	if (isNull(userId) || isNull(followerId)) {
		throw "All values must be provided";
	}

	if (!isOfType(userId, "string") || !isOfType(followerId, "string")) {
		throw "All values must be of type string";
	}

	userId = userId.trim();
	followerId = followerId.trim();

	if (!ObjectId.isValid(userId) || !ObjectId.isValid(followerId)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (isNull(user)) {
		throw "User not found";
	}

	if (user.followers.includes(new ObjectId(followerId))) {
		throw "User is already following this user";
	}

	const updateInfo = await userCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{ $addToSet: { followers: new ObjectId(followerId) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update user";
	}

	const updatedUser = await userCollection.findOne({
		_id: new ObjectId(userId),
	});
	return updatedUser;
};

/**
 * Removes a follower from a user's followers list.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} followerId - The ID of the follower to be removed.
 * @returns {Object} - The updated user object.
 */
export const removeFollower = async (userId, followerId) => {
	if (isNull(userId) || isNull(followerId)) {
		throw "All values must be provided";
	}

	if (!isOfType(userId, "string") || !isOfType(followerId, "string")) {
		throw "All values must be of type string";
	}

	userId = userId.trim();
	followerId = followerId.trim();

	if (!ObjectId.isValid(userId) || !ObjectId.isValid(followerId)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(userId) });
	if (isNull(user)) {
		throw "User not found";
	}

	if (!user.followers.includes(new ObjectId(followerId))) {
		throw "User is not following this user";
	}

	const updateInfo = await userCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{ $pull: { followers: new ObjectId(followerId) } }
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update user";
	}

	const updatedUser = await userCollection.findOne({
		_id: new ObjectId(userId),
	});
	return updatedUser;
};

export const updateUser = async (
	id,
	username,
	profilePicURL,
	bio
) => {
	if (
		isNull(id) ||
		isNull(username) ||
		isNull(profilePicURL) || 
		isNull(bio)
	) {
		throw "All values must be provided";
	}

	if (
		!isOfType(id, "string") ||
		!isOfType(username, "string") ||
		!isOfType(profilePicURL, "string") || 
		!isOfType(bio, "string")
	) {
		throw "All values must be of correct type";
	}
	bio = bio.trim();
	id = id.trim();
	username = username.trim();
	profilePicURL = profilePicURL.trim();

	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}

	const userCollection = await users();
	const user = await userCollection.findOne({ _id: new ObjectId(id) });
	if (isNull(user)) {
		throw "User not found";
	}

	const updateInfo = await userCollection.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				username: username,
				profilePicture: profilePicURL,
				bio: bio,
			},
		}
	);
	if (updateInfo.modifiedCount === 0) {
		throw "Could not update user";
	}
	const updatedUser = await userCollection.findOne({ _id: new ObjectId(id) });
	if(updatedUser === null) {
		throw "Error: could not find user";
	}
	return updatedUser;
};

export default { createUser, getUserById, deleteUser, getUserByUsername, getAllUsers, setAdminStatus, addFollower, removeFollower, updateUser };