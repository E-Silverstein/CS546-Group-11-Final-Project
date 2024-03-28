import { comments } from "../config/mongoCollections";
import * as helper from "../helpers.js"

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
 * @param {string} user - The user that created the comment.
 * @param {string} text - The text of the comment.
 * @returns {number} - Returns 0 if the comment is successfully created, otherwise returns 1.
 */
const create = async (
    user,
    text,
) => {
    if (helper.areAllValuesNotNull([user, text])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([user, text], 'string')) {
        return 1
    }

    user = user.trim();
    text = text.trim();

    // Check if the user exists
    const userCollection = await users();
    const userObj = await userCollection.findOne({ _id: user });
    if (helper.isNull(userObj)) {
        return 1;
    }

    const commentCollection = await comments();
    const newComment = {
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
