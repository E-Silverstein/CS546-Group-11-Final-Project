import { Router } from "express";
import { algoData, postData } from "../data/index.js";
let router = Router();

router
.route("/")
.get(async (req, res) => {
    try{
        const posts =await algoData.getRandomPosts();
        if (!posts) throw "Error: Could not get posts";
        if(req.session.authenticated){
            return res.render('home/home', {posts:posts, isAuth: true, userid: req.session.userid});
        }
        return res.render('home/home', {posts:posts,isAuth: false});
    } catch(e){
        return res.render('error/error', {error: e, isAuth: req.session.authenticated});
    }
    
});

router
.route('/getRecommendedPosts')
.get(async (req, res) => {
    /* Route will get all posts that are recommended for the user */
    try {
        if (!req.session.authenticated) throw "Error: User is not authenticated";
        if (!req.session.userid) throw "Error: User ID not found";

        const posts = await algoData.getRecommendedPosts(req.session.userid);
        if (!posts) throw "Error: Could not get posts";
        
        //TO-DO: change returns to render when frontend complete
        return res.status(200).render('home/home',{posts:posts,isAuth: req.session.authenticated});
    } catch (e) {
        return res.status(500).render('error/error', {error:e,isAuth: req.session.authenticated});
    }
});

router
.route('/getRandomPosts')
.get(async (req, res) => {
    /* Route will get all posts that are recommended for the user */
    try {
        const posts = await algoData.getRandomPosts();
        if (!posts) throw "Error: Could not get posts";
        return res.status(200).render('home/home',{posts:posts,isAuth: req.session.authenticated});
    } catch (e) {
        return res.status(500).render('error/error', {error:e,isAuth: req.session.authenticated});
    }
});


export default router;