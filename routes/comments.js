// IDK IF NEEDED
import express, { Router } from 'express';

import { commentData } from "../data/index.js";
import { isValidString } from '../helpers.js';

const router = express.Router();
router
.route('/:postid')
.post(async (req, res) => {
    const { postid } = req.params;
    const { userid } = req.session;
    const { commentText } = req.body;

    try {
        isValidString(postid);
        isValidString(userid);
        isValidString(commentText);
    } catch (e) {
        return res.status(400).render('error/error', {error: e, isAuth: req.session.authenticated});
    }

    try {
        await commentData.create(postid, userid, commentText);
        res.redirect(`/posts/${postid}`);
    } catch (error) {
        return res.status(500).render('error/error', {error: error, isAuth:req.session.authenticated});
    }
})
.delete(async (req, res) => {
    const { postid } = req.params;
    const { userid } = req.session;
    const { commentid } = req.body;

    try {
        isValidString(postid);
        isValidString(userid);
        isValidString(commentid);
    } catch (e) {
        return res.status(400).json({error: e});
    }

    try {
        await commentData.deleteComment(commentid, postid, userid);
        return res.status(200).json({success: true});
    } catch (e) {
        return res.status(500).json({error: e});
    }
});


export default router