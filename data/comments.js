import { comments } from "../config/mongoCollections";
import * as helper from "../helpers.js"
import { users } from "../config/mongoCollections";

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
 * @returns {number} - Returns 0 if the comment is successfully created, otherwise returns 1.
 */
const create = async (
    post,
    user,
    text,
) => {
    if (helper.areAllValuesNotNull([post, user, text])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([post, user, text], 'string')) {
        return 1
    }

    post = post.trim();
    user = user.trim();
    text = text.trim();

    if(!ObjectId.isValid(post) || !ObjectId.isValid(user)) {
        return 1;
    }

    // Check if the user exists
    const userCollection = await users();
    const userObj = await userCollection.findOne({ _id: user });
    if (helper.isNull(userObj)) {
        return 1;
    }

    const commentCollection = await comments();
    const newComment = {
        post,
        user,
        text,
        createdAt: new Date()
    };

    const insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) {
        return 1;
    }

    return 0;
}

/**
 * Gets a comment by its id.
 * @param {string} id - The id of the comment.
 * @returns {Object} - Returns the comment object if it exists, otherwise returns null.
 */
const getCommentById = async (id) => {
    if (helper.isNull(id)) {
        return null;
    }

    if (!helper.isOfType(id, 'string')) {
        return null;
    }

    id = id.trim();

    if(!ObjectId.isValid(id)) {
        return null;
    }

    const commentCollection = await comments();
    const commentObj = await commentCollection.findOne({ _id: id });
    if (helper.isNull(commentObj)) {
        return null;
    }

    return commentObj;
}

/**
 * Deletes a comment from the database.
 * @param {string} id - The id of the comment to be deleted.
 * @returns {number} - Returns 0 if the comment is successfully deleted, otherwise returns 1.
 */
const deleteComment = async (id) => {
    if (helper.isNull(id)) {
        return 1;
    }

    if (!helper.isOfType(id, 'string')) {
        return 1;
    }

    id = id.trim();

    if(!ObjectId.isValid(id)) {
        return 1;
    }

    const commentCollection = await comments();
    const deleteInfo = await commentCollection.deleteOne({ _id: id });
    if (deleteInfo.deletedCount === 0) {
        return 1;
    }

    return 0;
}
