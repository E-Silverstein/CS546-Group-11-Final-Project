import { reports } from "../config/mongoCollections";
import * as helper from "../helpers.js"

/**
 * Schema for Reports Collection
{
  "_id": "ObjectId",
  "reportedBy": "ObjectId (Users)",
  "reportedUser": "ObjectId (Users)",
  "reason": "string",
  "createdAt": "date",
  "status": "string (Pending/Resolved)"
}
 */