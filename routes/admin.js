import express from 'express';
import {ObjectId} from 'mongodb';
import {deletePost} from "./../data/posts.js";
import { getAllReports, deleteReport } from '../data/reports.js';
import { deleteUser } from '../data/users.js';
import {posts,users,reports} from "./../config/mongoCollections.js";
const router = express.Router();

//if admin you can see admin page that shows all reports (done in middleware)
//can delete posts that aren't theirs, ban a user, read it over and click complete and then
//it removes it from list of reports

router
.route('/')
.get(async (req,res)=>{
    try{
        let reports = await getAllReports(); //create get reports function in reports data
        if(!reports) throw "Error: Could not retrieve reports";
        //TODO will change to render admin page when html is ready
        //page should display reports for admin to review, with a button to delete
        //and a button to ban user
        return res.status(200).json("admin html");
    }catch(e)
    {
        return res.status(500).send(e);
    }
});

//deletes the post if admin chooses to
router
.route('/:postid')
.delete(async (req,res) => {
    try{
        //TODO get post using post id and then delete it
         //VALIDATION: postid
        if (req.params.postid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.postid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.postid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.postid)) throw "Error: 'postid' is not a valid ObjectId";
        req.params.postid = req.params.postid.trim();
    }catch(e){
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with id: "+req.params.postid+" does not exist";
    } catch (e) {
        res.status(404).send(e);
    }
    try {
        //deleting the post
        let deleteRes = await deletePost(req.params.postid);
        if (deleteRes==1) throw "Error: Post could not be deleted";
        return res.status(200).send("Delete Successful");
    } catch (e) {
        return res.status(500).send(e);
    }
});

//bans (deletes) the user if the admin wants to
router
.route('/:userid')
.delete(async (req,res) => {
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'postid' is not a valid ObjectId";
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if user exists
        const userCollection = await users();
        let user = await userCollection.find({ _id: new ObjectId(req.params.userid)});
        if (!user) throw "Error: user with id: "+req.params.userid+" does not exist";
    } catch(e) {
        res.status(404).send(e);
    }
    try{
        //deletes the user
        let deleteRes = await deleteUser(req.params.userid);
        if (deleteRes==1) throw "Error: Post could not be deleted";
        return res.status(200).send("Delete Successful");
    }catch(e){
        return res.status(500).send(e);
    }
});

router
.route('/approve')
.delete(async (req,res) => {
    try {
        //VALIDATION: if report exists
        const reportsCollection = await reports();
        let report = await reportsCollection.find({ _id: new ObjectId(req.params.reportid)});
        if (!report) throw "Error: user with id: "+req.params.reportid+" does not exist";
    } catch(e) {
        res.status(404).send(e);
    }
    try{
        //deletes the report
        let deleteReport = await deleteReport(req.params.reportid);
        if (deleteReport==1) throw "Error: Post could not be deleted";
        return res.status(200).send("Delete Successful");
    }catch(e){
        return res.status(500).send(e);
    }
});