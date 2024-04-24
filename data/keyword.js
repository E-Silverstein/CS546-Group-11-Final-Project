import { keywords } from "../config/mongoCollections.js";
import * as helper from "../helpers.js";
import { ObjectId } from "mongodb";

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
 * @returns {string} id - Returns the id of the created object
 */
export const create = async (keyword) => {
	if (helper.areAllValuesNotNull([keyword])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([keyword], "string")) {
		throw "All values must be of type string";
	}

	keyword = keyword.trim();

	const keywordCollection = await keywords();
	const newKeyword = {
		keyword,
		posts: [],
	};

	const insertInfo = await keywordCollection.insertOne(newKeyword);
	if (insertInfo.insertedCount === 0) {
		throw "Could not create keyword";
	}

	return insertInfo.insertedId.toString();
};

/**
 * Retrieves a keyword object by its ID.
 * @param {string} id - The ID of the keyword.
 * @returns {object} The keyword object.
 */
export const getKeywordById = async (id) => {
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

	const keywordCollection = await keywords();
	const keywordObj = await keywordCollection.findOne({ _id: id });
	if (helper.isNull(keywordObj)) {
		throw "Keyword does not exist";
	}

	return keywordObj;
};

/**
 * Deletes a keyword from the database and removes it from all associated posts.
 * @param {string} keyword - The keyword to be deleted.
 * @returns {boolean} - A promise that resolves to true if the keyword is successfully deleted
 */
export const deleteKeyword = async (keyword) => {
	if (helper.areAllValuesNotNull([keyword])) {
		throw "All values must be provided";
	}

	if (!helper.areAllValuesOfType([keyword], "string")) {
		throw "All values must be of type string";
	}

	keyword = keyword.trim();

	// Delete the keyword from all posts before deleting the keyword
	const postCollection = await posts();
	const postsWithKeyword = await postCollection
		.find({ keywords: keyword })
		.toArray();
	for (let i = 0; i < postsWithKeyword.length; i++) {
		const post = postsWithKeyword[i];
		const updatedKeywords = post.keywords.filter((k) => k !== keyword);
		const updatedPost = {
			...post,
			keywords: updatedKeywords,
		};
		await postCollection.updateOne({ _id: post._id }, { $set: updatedPost });
	}

	const keywordCollection = await keywords();
	const deletionInfo = await keywordCollection.deleteOne({ keyword });
	if (deletionInfo.deletedCount === 0) {
		throw "Could not delete keyword";
	}

	return true;
};
