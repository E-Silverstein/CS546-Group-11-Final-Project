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

/**
 * Creates a new report in the database.
 * @param {string} reportedBy - The ObjectID of the user that created the report.
 * @param {string} reportedPost - The ObjectID of the post that is being reported.
 * @param {string} reason - The reason for the report.
 * @returns {Object} - Returns the created object.
 */
export const create = async (reportedBy, reportedUser, reason) => {
  if (helper.areAllValuesNotNull([reportedBy, reportedUser, reason])) {
    throw "All values must be provided";
  }

  if (!helper.areAllValuesOfType([reason], "string")) {
    throw "All values must be of type string";
  }

  reason = reason.trim();

  if (!ObjectId.isValid(reportedBy) || !ObjectId.isValid(reportedUser)) {
    throw "Invalid ObjectID";
  }

  const reportCollection = await reports();
  const newReport = {
    reportedBy,
    reportedUser,
    reason,
    createdAt: new Date(),
    status: "Pending",
  };

  const insertInfo = await reportCollection.insertOne(newReport);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create report";
  }

  const insertedObject = await reportCollection.findOne({
    _id: insertInfo.insertedId,
  });
  return insertedObject;
};

/**
 * Retrieves a report object by its ID.
 * @param {string} id - The ID of the report.
 * @returns {object} The report object.
 */
export const getReportById = async (id) => {
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

  const reportCollection = await reports();
  const report = await reportCollection.findOne({ _id: new ObjectId(id) });
  if (helper.isNull(report)) {
    throw "Report not found";
  }
  return report;
}

/**
 * Retrieves all reports in the database.
 * @returns {Array} - Returns an array of all reports.
 */
export const getAllReports = async () => {
  const reportCollection = await reports();
  return await reportCollection.find({}).toArray();
}