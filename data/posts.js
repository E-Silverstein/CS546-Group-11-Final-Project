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
---------------------------------------------
* Schema for Comments Sub Collection
{
  "_id": "ObjectId",
  "user": "ObjectId (Users)",
  "text": "string",
  "createdAt": "Date"
}
 */