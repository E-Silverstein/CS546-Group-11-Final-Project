import { reports } from "../config/mongoCollections.js";
import * as helper from "../helpers.js"

/**
 * Schema for Reports Collection
{
  "_id": "ObjectId",
  "postId": "postId",
  "reportedBy": "ObjectId (Users)",
  "reportedUser": "ObjectId (Users)",
  "reason": "string",
  "createdAt": "date",
  "status": "string (Pending/Resolved)"
}
 */

//for reports, we need to create report, and have ability to get all reports for the 
//admin dashboard. We should also be able to delete report when it is resolved?

//Q: when a report is resolved, should it be deleted or should it be "resolved" and still
//be data to see somewhere?

/**
 * creates a report with these necessary fields
 * @param {postId} postId
 * @param {User} reportedBy 
 * @param {User} reportedUser 
 * @param {string} reason 
 * @param {Date} createdAt 
 * @param {string} status 
 * @return {Object} - returns created report
 */
export const createReport = async(postId,reportedBy,reportedUser,reason,createdAt,status) => {
  //check if postId is a valid post id
  //check if reportedBy is a valid user
  //check if reportedUser is a valid user

  if(helper.areAllValuesNotNull([postId,reportedBy,reportedUser,reason,createdAt,status])){
    throw "Error: All values are not provided";
  }

  if(!helper.areAllValuesOfType([reason,status],'string')){
    throw "Error: Values are not of correct type";
  }
  reason = reason.trim();
  status = status.trim();

  //check date is valid(it will just be from req anyways so it should always be correct)

  const newReport = {
    postId:postId,
    reportedBy: reportedBy,
    reportedUser: reportedUser,
    reason:reason,
    createdAt:createdAt,
    status:status
  };

  const reportCollection = await reports();
  const insertReport = await reportCollection.insertOne(newReport);
  if (insertReport.insertedCount === 0) {
		throw "Could not create report";
	}
  //return the created report by looking for report in collection and returning it?
  const insertedReport = await reportCollection.findOne({
		_id: insertReport.insertedId,
	});
	return insertedReport;
}

/**
 * get all reports from collection
 * @returns {Array} list of reports 
 */
export const getAllReports = async () => {
	const reportCollection = await reports();
	const reportList = await reportCollection.find({}).toArray();
	return reportList;
};

/**
 * Grabs the report by the id of report
 * @param {reportId} id 
 * @returns the report
 */
export const getReportById = async(id) => {
  if (isNull(id)) {
		throw "ID must be provided";
	}
	if (!isOfType(id, "string")) {
		throw "ID must be of type string";
	}
	id = id.trim();
	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}
  const reportsCollection = await reports();
	const report = await reportsCollection.findOne({ _id: new ObjectId(id) });
	if (isNull(report)) {
		throw "User not found";
	}

	return report;
}

/**
 * Deletes the report (used after admin makes choice of (approve/remove post/ban user))
 * @param {report Id} id 
 * @returns {boolean} true 
 */
export const deleteReport = async(id) => {
  if (isNull(id)) {
		throw "ID must be provided";
	}
	if (!isOfType(id, "string")) {
		throw "ID must be of type string";
	}
	id = id.trim();
	if (!ObjectId.isValid(id)) {
		throw "Invalid ObjectID";
	}
  const reportsCollection = await reports();
  const deleteInfo = await reportsCollection.deleteOne({ _id: new ObjectId(id) });
	if (deleteInfo.deletedCount === 0) {
		throw "Could not delete report";
	}

	return true;
};