import { users } from "../config/mongoCollections";
import * as helper from "../helpers.js"

/* Schema for User
{
  "_id": "ObjectId",
  "username": "string",
  "passwordHash": "string",
  "profilePicture": "string (URL)",
  "age": "number",
  "createdAt": "Date",
  "followers": ["ObjectId (Users)"],
  "following": ["ObjectId (Users)"],
  "posts": ["ObjectId (Posts)"],
  "likedKeywords": [
    {
      "keyword": “ObjectID (Keyword)”,
      "count": "number"
    }
  ]
}
*/

/**
 * Creates a user in the users collection
 * @param {string} username 
 * @param {string} passwordHash
 * @param {string} profilePicURL 
 * @param {number} age 
 * @param {Date} createdAt 
 */
const create = async (
    username,
    passwordHash,
    profilePicURL,
    age,
    createdAt
) => {
    if (areAllValuesNotNull([
        username,
        passwordHash,
        profilePicURL,
        age,
        createdAt
    ])) {
        return 1; // Placeholder value for failed function
    }

    if (!areAllValuesOfType([
        username,
        passwordHash,
        profilePicURL
    ], 'string'
    )) {
        return 1
    }

    username = username.trim();
    passwordHash = passwordHash.trim();
    profilePicURL = profilePicURL.trim();

    if (!isOfType(age, 'number')) {
        return 1;
    }

    if (!(createdAt instanceof Date)) {
        return 1;
    }

    // TODO check valid profilePicURL

    // TODO make sure password type is correct

    const newUser = {
        username: username,
        passwordHash: passwordHash,
        profilePicture: profilePicURL,
        age: age,
        createdAt: createdAt,
        followers: [],
        following: [],
        posts: [],
        likedKeywords: []
    };   
    
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) {
        return 1;
    }

    return 0;
}



/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {number} - Returns 0 if the user is found, or 1 if not found.
 */
const getUserById = async (id) => {
    if (isNull(id)) {
        return 1;
    }

    if (!isOfType(id, 'string')) {
        return 1;
    }

    id = id.trim();

    if(!ObjectId.isValid(id)) {
        return 1;
    }

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    if (isNull(user)) {
        return 1;
    }

    return 0;
}


/**
 * Deletes a user from the database.
 * @param {string} id - The ID of the user to be deleted.
 * @returns {number} - Returns 0 if the user is successfully deleted, 1 otherwise.
 */
const deleteUser = async (id) => {
    if (isNull(id)) {
        return 1;
    }

    if (!isOfType(id, 'string')) {
        return 1;
    }

    id = id.trim();

    if(!ObjectId.isValid(id)) {
        return 1;
    }

    const userCollection = await users();
    
    // TODO delete user from all posts, comments, reports, followers and following lists, and delete their posts

    const deleteInfo = await userCollection.deleteOne({ _id: id });
    
    if (deleteInfo.deletedCount === 0) {
        return 1;
    }

    return 0;
}