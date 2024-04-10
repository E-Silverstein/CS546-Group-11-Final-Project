import { keywords } from "../config/mongoCollections";
import * as helper from "../helpers.js"
import {ObjectId} from 'mongodb';

/**
 * Schema for Keyword
{
  "_id": "ObjectId",
  "keyword": "string",
  "posts": ["ObjectId (Posts)"]
}
 */

/**
 * Creates a new keyword in the database.
 * @param {string} keyword - The keyword to be created.
 * @returns {number} - Returns 0 if the keyword is successfully created, otherwise returns 1.
 */
const create = async (
    keyword,
) => {
    if (helper.areAllValuesNotNull([keyword])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([keyword], 'string')) {
        return 1
    }

    keyword = keyword.trim();

    const keywordCollection = await keywords();
    const newKeyword = {
        keyword,
        posts: []
    };

    const insertInfo = await keywordCollection.insertOne(newKeyword);
    if (insertInfo.insertedCount === 0) {
        return 1;
    }

    return 0;
}

const getKeywordById = async (id) => {
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

    const keywordCollection = await keywords();
    const keywordObj = await keywordCollection.findOne({ _id: id });
    if (helper.isNull(keywordObj)) {
        return null;
    }

    return keywordObj;
}

/**
 * Deletes a keyword from the database.
 * @param {string} keyword - The keyword to be deleted.
 * @returns {number} - Returns 0 if the keyword is successfully deleted, otherwise returns 1.
 */
const deleteKeyword = async (keyword) => {
    if (helper.areAllValuesNotNull([keyword])) {
        return 1;
    }

    if (!helper.areAllValuesOfType([keyword], 'string')) {
        return 1;
    }

    keyword = keyword.trim();

    // Delete the keyword from all posts before deleting the keyword
    const postCollection = await posts();
    const postsWithKeyword = await postCollection.find({ keywords: keyword }).toArray();
    for (let i = 0; i < postsWithKeyword.length; i++) {
        const post = postsWithKeyword[i];
        const updatedKeywords = post.keywords.filter(k => k !== keyword);
        const updatedPost = {
            ...post,
            keywords: updatedKeywords
        }
        await postCollection.updateOne({ _id: post._id }, { $set: updatedPost });
    }

    const keywordCollection = await keywords();
    const deletionInfo = await keywordCollection.deleteOne({ keyword });
    if (deletionInfo.deletedCount === 0) {
        return 1;
    }

    return 0;
}