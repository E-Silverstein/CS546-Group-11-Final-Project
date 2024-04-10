import { posts } from "../config/mongoCollections";
import * as helper from "../helpers.js"

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
 * @param {Array<string>} likes - The users that liked the post.
 * @param {Array<string>} comments - The comments associated with the post.
 * @param {Date} createdAt - The date the post was created.
 * @returns {number} - Returns 0 if the post is successfully created, otherwise returns 1.
 */
const create = async (
    user,
    image,
    clothingLinks,
    keywords
) => {
    if (helper.areAllValuesNotNull([user, image, clothingLinks, keywords])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([user, image], 'string')) {
        return 1
    }

    user = user.trim();
    image = image.trim();

    if (!helper.isArrayOfType(clothingLinks, 'string')) {
        return 1;
    }

    if (!helper.isArrayOfType(keywords, 'string')) {
        return 1;
    }

    // Check if the user exists
    const userCollection = await users();
    const userObj = await userCollection.findOne({ _id: user });
    if (helper.isNull(userObj)) {
        return 1;
    }

    // Check if the keywords exist if they do not exist create them
    const keywordCollection = await keywords();
    for (let i = 0; i < keywords.length; i++) {
        const keywordObj = await keywordCollection.findOne({ keyword: keywords[i] });
        if (helper.isNull(keywordObj)) {
            const keyword = await create(keywords[i]);
            if (keyword === 1) {
                return 1;
            }
        }
    }

    // TODO Check that the image URLs are valid

    // Check that clothing URL is valid using a regex
    for (let i = 0; i < clothingLinks.length; i++) {
        if (!helper.isValidURL(clothingLinks[i])) {
            return 1;
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
        createdAt: new Date()
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) {
        return 1;
    }

    return 0;
}

/**
 * Gets a post by its ID.
 * @param {string} id - The ID of the post.
 * @returns {object} - Returns the post if it exists, otherwise returns null.
 */
const getPostById = async (id) => {
    if (helper.isNull(id)) {
        return null;
    }

    if (!helper.isOfType(id, 'string')) {
        return null;
    }

    id = id.trim();

    if (!ObjectId.isValid(id)) {
        return null;
    }

    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: id });
    if (helper.isNull(post)) {
        return null;
    }

    return post;
}

const deletePost = async (id) => {
    if (helper.isNull(id)) {
        return 1;
    }

    if (!helper.isOfType(id, 'string')) {
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
}

/**
 * Retrieves all posts from the database.
 * @returns {Array} - Returns a list of all posts.
 */
const getAllPosts = async () => {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    return postList;
}

/**
 * Retrieves all posts by a user.
 * @param {string} user - The user to retrieve posts for.
 * @returns {Array} - Returns a list of all posts by the user.
 */
const getPostsByUser = async (user) => {
    if (helper.isNull(user)) {
        return null;
    }

    if (!helper.isOfType(user, 'string')) {
        return null;
    }

    user = user.trim();

    if (!ObjectId.isValid(user)) {
        return null;
    }

    const postCollection = await posts();
    const postList = await postCollection.find({ user }).toArray();
    return postList;
}

/**
 * Retrieves all posts by a keyword.
 * @param {string} keyword - The keyword to retrieve posts for.
 * @returns {Array} - Returns a list of all posts by the keyword.
 */
const getPostsByKeyword = async (keyword) => {
    if (helper.isNull(keyword)) {
        return null;
    }

    if (!helper.isOfType(keyword, 'string')) {
        return null;
    }

    keyword = keyword.trim();

    const postCollection = await posts();
    const postList = await postCollection.find({ keywords: keyword }).toArray();
    return postList;
}

/**
 * Retrieves all posts that a user has liked.
 * @param {string} user - The user to retrieve liked posts for.
 * @returns {Array} - Returns a list of all posts that the user has liked.
 */
const getLikedPostsByUser = async (user) => {
    if (helper.isNull(user)) {
        return null;
    }

    if (!helper.isOfType(user, 'string')) {
        return null;
    }

    user = user.trim();

    if (!ObjectId.isValid(user)) {
        return null;
    }

    const postCollection = await posts();
    const postList = await postCollection.find({ likes: user }).toArray();
    return postList;
}

/**
 * Adds a like to a post.
 * @param {string} user - The user that liked the post.
 * @param {string} post - The post that was liked.
 * @returns {number} - Returns 0 if the like is successfully added, otherwise returns 1.
 */
const addLike = async (user, post) => {
    if (helper.areAllValuesNotNull([user, post])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([user, post], 'string')) {
        return 1;
    }

    user = user.trim();
    post = post.trim();

    if (!ObjectId.isValid(user) || !ObjectId.isValid(post)) {
        return 1;
    }

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne({ _id: post }, { $push: { likes: user } });
    if (updateInfo.modifiedCount === 0) {
        return 1;
    }

    return 0;
}

/**
 * Removes a like from a post.
 * @param {string} user - The user that unliked the post.
 * @param {string} post - The post that was unliked.
 * @returns {number} - Returns 0 if the like is successfully removed, otherwise returns 1.
 */
const removeLike = async (user, post) => {
    if (helper.areAllValuesNotNull([user, post])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([user, post], 'string')) {
        return 1;
    }

    user = user.trim();
    post = post.trim();

    if (!ObjectId.isValid(user) || !ObjectId.isValid(post)) {
        return 1;
    }

    const postCollection = await posts();
    const updateInfo = await postCollection.updateOne({ _id: post }, { $pull: { likes: user } });
    if (updateInfo.modifiedCount === 0) {
        return 1;
    }

    return 0;
}