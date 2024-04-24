import { users } from "../config/mongoCollections.js";
import {areAllValuesNotNull, areAllValuesOfType, isNull, isOfType} from "../helpers.js";
import { ObjectId } from 'mongodb';

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
export const create = async (
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
        return 'All values must be provided'; 
    }

    if (!areAllValuesOfType([
        username,
        passwordHash,
        profilePicURL
    ], 'string'
    )) {
        return 'All values must be of type string';
    }

    username = username.trim();
    passwordHash = passwordHash.trim();
    profilePicURL = profilePicURL.trim();

    if (!isOfType(age, 'number')) {
        return 'Age must be of type number';
    }

    if (!(createdAt instanceof Date)) {
        return 'createdAt must be of type Date';
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
        return 'Could not create user';
    }

    return 0;
}



/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {number} - Returns 0 if the user is found, or 1 if not found.
 */
export const getUserById = async (id) => {
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
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (isNull(user)) {
        return 'User not found';
    }

    return 0;
}


/**
 * Deletes a user from the database.
 * @param {string} id - The ID of the user to be deleted.
 * @returns {number} - Returns 0 if the user is successfully deleted, 1 otherwise.
 */
export const deleteUser = async (id) => {
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

    const deleteInfo = await userCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (deleteInfo.deletedCount === 0) {
        return 1;
    }

    return 0;
}

export const getUserByUsername = async (username) => {
    if (isNull(username)) {
        return null;
    }

    if (!isOfType(username, 'string')) {
        return null;
    }

    username = username.trim();

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (isNull(user)) {
        return null;
    }

    return user._id.toString();
}

/**
 * Retrieves all users from the database.
 * @returns {Array} - Returns an array of user objects.
 */
export const getAllUsers = async () => {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
}

export const setAdminStatus = async (id, isAdmin) => {
    if (isNull(id) || isNull(isAdmin)) {
        return 1;
    }

    if (!isOfType(id, 'string') || !isOfType(isAdmin, 'boolean')) {
        return 1;
    }

    id = id.trim();

    if(!ObjectId.isValid(id)) {
        return 1;
    }

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: { isAdmin: isAdmin } });
    if (updateInfo.modifiedCount === 0) {
        return 1;
    }

    return 0;
}