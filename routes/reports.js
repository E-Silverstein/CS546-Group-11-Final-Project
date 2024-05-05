import { reportData } from "../data/index.js";
import express, { Router } from 'express';
import { getUserByUsername } from "../data/users.js";
import { getPostById } from "../data/posts.js";
import { ObjectId } from "mongodb";
import * as helper from "../helpers.js"
const router = express.Router();

router
.route('/') 
    .get(async (req, res) => {
        res.status(200).render("report submission page");
    })
    .post(async (req, res) => {
        try{
            if(helper.areAllValuesNotNull([req.postId,req.reportedBy,req.reason])){
                throw "Error: All values are not provided";
            }
            if(!helper.areAllValuesOfType([req.reportedBy,req.reason],'string')){
                throw "Error: Value are not of correct type";
            }
        }catch(e){
            return res.status(400).json(e);
        }
        try{
            if (!ObjectId.isValid(req.postId)) {
                throw "Invalid ObjectID";
            }
            const reportedById = await getUserByUsername(req.reportedBy);
            if (!ObjectId.isValid(reportedById)) {
		        throw "Invalid ObjectID";
	        }
            const post = await getPostById(req.postId.toString());
            const reportedUserId = await getUserByUsername(post.username);
            if (!ObjectId.isValid(reportedUserId)) {
		        throw "Invalid ObjectID";
	        }
        } catch (e) {
            return res.status(400).json(e);
        }
        try {
            return res.status(200).render("reportsubmissionpage");
        } catch (e) {
            return res.status(400).json(e);          
        }
    });

export default router