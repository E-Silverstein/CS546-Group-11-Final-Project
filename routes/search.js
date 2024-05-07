import { postData, userData, commentData } from "../data/index.js";
import { ObjectId } from "mongodb";
import { Router } from 'express';
import xss from "xss";
import { isValidKeyword } from "../helpers.js";
const router = Router();

router
.route('/')
    .get(async (req, res) => {
        // TODO: Change, when search/search page is made, to actual location
        let { keywords, query } = req.query;

        if(!(keywords || query)) {
            return res.status(400).render("error/error", { error: "Please provide at least 1 keyword and/or a query." , isAuth: req.session.authenticated});
        }

        if(!(typeof keywords === 'string' || query === 'string')) {
            return res.status(400).render("error/error", { error: "Keywords and query must both be strings." , isAuth: req.session.authenticated});
        }

        if(keywords === '') keywords = [];
        else keywords = keywords.split(',');
        try {
            keywords.forEach(kw => {
                isValidKeyword(kw);
            });
        } catch(e) {
            return res
            .status(400)
            .render("error/error", {
              error:
                "Keywords must be an array of strings, each of length 3-16 inclusive.",
              isAuth: req.session.authenticated,
            });
        };
        keywords = keywords.map(kw => xss(kw));
        keywords = keywords.map(kw => kw.trim().toLowerCase());
        query = xss(query);
        query = query.trim();
        
        let renderData = {};
        try {
            let getAllPosts = [];
            for(let i = 0; i < keywords.length; i++) {
                let posts = await postData.getPostsByKeyword(keywords[i]);
                for(let j = 0; j < posts.length; j++) {
                    let post = posts[j];
                    let commentids = post.comments;
                    let comments = [];
                    for(let k = 0; k < commentids.length; k++) {
                        let comment = await commentData.getCommentById(commentids[k].toString());
                        let user = await userData.getUserById(comment.user.toString());
                        comments.push({"username": user.username, "text": comment.text});
                    }
                    post.comments = comments;
                    post.liked = post.likes.map(like => like.toString()).includes(req.session.userid);
                    post.likes = post.likes.length;
                    getAllPosts = getAllPosts.concat(post);
                }
            }
            renderData.posts = getAllPosts;
        } catch(e) {
            renderData.posts = [];
            console.log(e);
        }
        try {
            let users = await userData.searchUserByUsername(query);
            renderData.users = users;
        } catch(e) {
            renderData.users = null;
            console.log(e);
        }
        
        console.log(renderData);
 
        return res.status(200).render("search/search", { isAuth: req.session.authenticated, users: renderData.users, posts: renderData.posts});
    });
    
export default router;