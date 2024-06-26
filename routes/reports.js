import { reportData } from "../data/index.js";
import express, { Router } from 'express';
import { getUserByUsername } from "../data/users.js";
import { getPostById } from "../data/posts.js";
import { ObjectId } from "mongodb";
import * as helper from "../helpers.js";
import xss from 'xss';
const router = express.Router();

router
.route('/') 
    .post(async (req, res) => {
        try{
            if(helper.areAllValuesNotNull([req.body.postId,req.body.username,req.body.reason])){
                throw "Error: All values are not provided";
            }
            if(!helper.areAllValuesOfType([req.body.username,req.body.reason],'string')){
                throw "Error: Value are not of correct type";
            }
        }catch(e){
            return res.render('home/home', {isAuth: false});
        }
        try{
            req.body.postId = xss(req.body.postId.trim());
            if (!ObjectId.isValid(req.body.postId)) {
                throw "Invalid ObjectID";
            }
            // const reportedById = await getUserByUsername(req.reportedBy);
            // if (!ObjectId.isValid(reportedById)) {
		    //     throw "Invalid ObjectID";
	        // }
            const post = await getPostById(req.body.postId);
            const reportedUserId = await getUserByUsername(post.username);
            if (!ObjectId.isValid(reportedUserId)) {
		        throw "Invalid ObjectID";
	        }
        } catch (e) {
            return res.render('home/home', {isAuth: false});

        }
        try {
            req.body.username = xss(req.body.username.trim());
            req.body.reason = xss(req.body.reason.trim());
            const report = await reportData.createReport(req.body.postId,req.body.username,req.body.reason);
            if(!report) throw "Error: no report created";
            //return res.status(200)
        } catch (e) {
            return res.render('home/home', {isAuth: false});
         
        }
    });

export default router