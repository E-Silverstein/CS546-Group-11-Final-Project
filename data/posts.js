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

    // TODO Check that the image and clothing URLs are valid

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

    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: id });
    if (helper.isNull(post)) {
        return null;
    }

    return post;
}
