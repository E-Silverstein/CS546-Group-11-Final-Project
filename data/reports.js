import { reports } from "../config/mongoCollections";
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

