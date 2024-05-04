import { reports } from "../config/mongoCollections.js";
import { getUserByUsername } from "./users.js";
import { ObjectId } from "mongodb";
import * as helper from "../helpers.js"
import { getPostById } from "./posts.js";

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
 * creates a report with these necessary fields. Input the postId, reportedBy, Reason
 * @param {postId} postId -needs the post id, will be a button on the post so its easy to get postid
 * @param {User} reportedBy - username of who reported the post
 * @param {User} reportedUser 
 * @param {string} reason 
 * @param {Date} createdAt 
 * @param {string} status 
 * @return {Object} - returns created report
 */
export const createReport = async(postId,reportedBy,reason) => {
  if(helper.areAllValuesNotNull([postId,reportedBy,reason])){
    throw "Error: All values are not provided";
  }

  if(!helper.areAllValuesOfType([reportedBy,reason],'string')){
    throw "Error: Value are not of correct type";
  }
  //check if postId is a valid post id
  if (!ObjectId.isValid(postId)) {
		throw "Invalid ObjectID";
	}
  //check if reportedBy is a valid user
  const reportedById = await getUserByUsername(reportedBy.trim());
  if (!ObjectId.isValid(reportedById)) {
		throw "Invalid ObjectID";
	}
  //check if reportedUser is a valid user
  const post = await getPostById(postId.toString());
  const reportedUserId = await getUserByUsername(post.username);
  if (!ObjectId.isValid(reportedUserId)) {
		throw "Invalid ObjectID";
	}

  reason = reason.trim();

  const newReport = {
    postId:postId,
    reportedBy: reportedById,
    reportedUser: reportedUserId,
    reason:reason,
    createdAt: new Date(),
    status:"Pending"
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

export default { createReport, getAllReports, getReportById, deleteReport };