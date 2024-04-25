import { comments } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import * as postData from "./posts.js";
import { ObjectId } from "mongodb";
/**
* Schema for Comments Sub Collection
{
  "_id": "ObjectId",
  "user": "ObjectId (Users)",
  "text": "string",
  "createdAt": "Date"
}
 */

/**
 * Creates a new comment in the database.
 * @param {string} post - The ObjectID of the post that the comment is associated with.
 * @param {string} user - The ObjectID of the user that created the comment.
 * @param {string} text - The text of the comment.
 * @returns {Object} - Returns the created object.
 */
export const create = async (post, user, text) => {
	if (helper.areAllValuesNotNull([post, user, text])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([text], "string")) {
		throw "All values must be of type string";
	}

	text = text.trim();

	if (!ObjectId.isValid(post) || !ObjectId.isValid(user)) {
		throw "Invalid ObjectID";
	}

	// Check if the user exists
	const userCollection = await users();
	const userObj = await userCollection.findOne({ _id: new ObjectId(user) });
	if (helper.isNull(userObj)) {
		throw "User does not exist";
	}

	const commentCollection = await comments();
	const newComment = {
		post,
		user,
		text,
		createdAt: new Date(),
	};

	const insertInfo = await commentCollection.insertOne(newComment);
	if (insertInfo.insertedCount === 0) {
		throw "Could not create comment";
	}

	const insertedObject = await commentCollection.findOne({
		_id: insertInfo.insertedId,
	});

    // Add the comment to the post
    await postData.addComment(post.toString(), insertedObject._id.toString());

	return insertedObject;
};

/**
 * Gets a comment by its id.
 * @param {string} id - The id of the comment.
 * @returns {Object} - Returns the comment object if it exists, otherwise returns null.
 */
export const getCommentById = async (id) => {
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

	const commentCollection = await comments();
	const commentObj = await commentCollection.findOne({ _id: id });
	if (helper.isNull(commentObj)) {
		throw "Comment does not exist";
	}

	return commentObj;
};

/**
 * Deletes a comment from the database.
 * @param {string} id - The id of the comment to be deleted.
 * @returns {boolean} - Returns true successfully deleted.
 */
export const deleteComment = async (id) => {
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

	const commentCollection = await comments();
	const deleteInfo = await commentCollection.deleteOne({ _id: id });
	if (deleteInfo.deletedCount === 0) {
		throw "Could not delete comment";
	}

	return true;
};
