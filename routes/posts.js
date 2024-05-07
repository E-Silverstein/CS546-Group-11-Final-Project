/*
    ROUTES ARE NOT TESTED YET
*/

import { commentData, postData } from "../data/index.js";
import { userData } from "../data/index.js";

import {posts} from "../config/mongoCollections.js";
import express from 'express';
import {ObjectId} from 'mongodb';
import {upload} from '../middleware.js';
import { isValidImg, isValidKeyword, isValidLink, isValidString, isValidId } from "../helpers.js";
import xss from "xss";

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    return res.redirect('/home');
})
// upload.single('name') takes in the name of the INPUT ELEMENT that the file is being inputted to
.post(upload.single('post-image'), async (req, res) => {


    try {
        //VALIDATION: image 
        /*multer will send file information to req.file
            important attributes:
            - fieldname: input element name
            - mimetype: type of file
        */
       if (!isValidImg(req.file)) throw "Error: invalid image";
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";

        if (typeof req.body.clothingLinks == 'string') {
            if (!isValidLink(req.body.clothingLinks)) throw "Error: invalid link";
            req.body.clothingLinks = [xss(req.body.clothingLinks.trim())];
        }
        else {
            for (let i = 0; i < req.body.clothingLinks.length ; i++) {
                let link = req.body.clothingLinks[i];
                if (!isValidLink(link)) throw "Error: invalid link";
                req.body.clothingLinks[i] = xss(link.trim());
            }
        }

     } catch(e) {
        console.log(e)
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";
        
        if (typeof req.body.keywords == 'string') {
            if (!isValidKeyword(req.body.keywords)) {
                throw "Error: Invalid Keyword"
            }
            req.body.keywords = [xss(req.body.keywords .trim())];
        }
        else {
            for (let i = 0; i < req.body.keywords.length ; i++) {
                let keyword = req.body.keywords[i];
               
                if(!isValidKeyword(keyword)) throw "Error: Invalid keyword"
                req.body.keywords[i] = xss(keyword.trim());
            }
        }
    } catch(e) {
        console.log(e)

        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
         //VALIDATION: description
        if(!isValidString(req.body.description, 5, 256)) throw "Error: invalid description"
        req.body.description = xss(req.body.description.trim());

    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        let newPost = await postData.createPost(
                                req.session.userid,
                                '/'+req.file.path,
                                req.body.clothingLinks,
                                req.body.keywords,
                                req.body.description
                            );

        if (!newPost) throw "Error: Post could not be created"

        // will redirect to the newly created post
        return res.status(200).redirect(`/posts/${newPost._id.toString()}`)
    } catch(e) {
        console.log(e)

        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
});

router
.route("/createPost")
.get(async(req, res) => {
    if(!req.session.authenticated){
        return res.status(200).redirect('/login');
    }
    return res.status(200).render('posts/newpost', {isAuth: req.session.authenticated});
});

router
.route('/editPost/:postid')
.get(async (req,res) => {

    try {
        //VALIDATION: postid
        if(!req.session.authenticated) throw "Error: You must be logged in to edit a post";
        if(!isValidId(req.params.postid)) throw "Error: invalid id"
        req.params.postid = req.params.postid.trim();
        let post = await postData.getPostById(req.params.postid);
        if(!post) throw "Error: Post does not exist";
        let user = await userData.getUserById(req.session.userid);
        if(post.username != user.username) throw "Error: You do not own this post";
        return res.status(200).render('posts/editpost', {postid: req.params.postid, isAuth: req.session.authenticated});
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
});

router
.route('/:postid')
.get(async (req, res) => {
    /* Route will get an individual post given a postid */
    try {
        //VALIDATION: postid
        if (!isValidId(req.params.postid)) throw "Error: invalid id"
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        return res.status(400).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        let post = await postData.getPostById(req.params.postid);
        let userid = req.session.userid;
        let posterId = await userData.getUserByUsername(post.username);
        if (post==null) throw "Error: No Posts found with id: "+req.params.postid;;
        //TO-DO: change returns to render when frontend complete
        console.log(post.image);

        let comments = [];
        for (let i = 0; i < post.comments.length; i++) {
            let comment = await commentData.getCommentById(post.comments[i].toString());
            console.log(comment);
            let user = await userData.getUserById(comment.user.toString());
            comments.push({
              username: user.username,
              comment: comment.text,
              id:
                comment.user.toString() === req.session.userid
                  ? comment._id.toString()
                  : null,
            });
        }

        // Check if user liked the post
        let isLiked = false;
        for(let i = 0; i < post.likes.length; i++) {
            if(post.likes[i].toString() === userid) {
                isLiked = true;
                break;
            }
        }
        console.log(posterId);
        return res
          .status(200)
          .render("posts/singlepost", {
            posterId: posterId,
            postid: post._id,
            username: post.username,
            image: post.image,
            clothingLinks: post.clothingLinks,
            description: post.description,
            keywords: post.keywords,
            likes: post.likes.length,
            comments: comments,
            isAuth: req.session.authenticated,
            isLiked: isLiked,
          });

    } catch (e) {
        return res.status(404).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
})
.patch(upload.single('post-image'), async (req, res) => {
    /*will update a pre-existing post with new data provided from an edit form*/
    
    try {
        //VALIDATION: postid
        if (!isValidId(req.params.postid)) throw "Error: invalid id"
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with postid: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});

        if (req.session.user.username != post.user) throw "Error: You do not own this post"

    } catch(e) {
        res.status(403).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: image 
        if (!req.file) throw "Error: Requires a 'image' input";
        if (!req.file.mimetype.includes('image/')) throw "Error: 'image' input is incorrect file type";
        
    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        //may be unnecessary: if (req.body.clothingLinks.length == 0) throw "Error: List of clothing links is empty"
        for (let i = 0; i < req.body.clothingLinks.length ; i++) {
            let link = req.body.clothingLinks[i];
            if (!isValidLink(link)) throw "Error: invalid link"
            req.body.clothingLinks[i] = xss(link.trim());
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";


        //may be unnecessary: if (req.body.keywords.length == 0) throw "Error: List of keywords is empty"
        for (let i = 0; i < req.body.keywords.length ; i++) {
            let keyword = req.body.keywords[i];
            if(!isValidKeyword(keyword)) throw "Error: invalid keyword"
            req.body.keywords[i] = xss(keyword.trim());
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    } 
    try {
        //VALIDATION: description
       if(!isValidString(req.body.description, 0, 256)) throw 'Error: invalid description';
        req.body.description = xss(req.body.description.trim());
   } catch(e) {
       return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
   }
    try {
       let updateRes = await postData.updatePost(req.params.postid, req.file.path, req.body.clothingLinks, req.body.keywords);
       if (updateRes == null) throw "Error: Post could not be updated"
       
       //TO-DO: change returns to render when frontend complete
        return res.status(200).redirect(`/posts/${updateRes._id.toString()}`)

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
})
.delete(async (req, res) => {
    /* will delete pre-existing post */
    try {
        //VALIDATION: postid
        if(!isValidId(req.params.postid)) throw "Error: invalid id";
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with id: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        //TO-DO: initialize session state

        if (req.session.user.username != post.user) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
    try {
        let deleteRes = await postData.deletePost(req.params.postid);
        if (deleteRes==1) throw "Error: Post could not be deleted";

        return res.status(200).send("Delete Successful");

    } catch(e) {
        return res.status(500).render('error/error', {error:e, isAuth: req.session.authenticated});
    }
});


// Route to add like to a post
router
.route('/addLike/:postId')
.patch(async (req, res) => {
    try {
        if (!req.session.authenticated) throw "Error: User is not authenticated";
        if (!req.session.userid) throw "Error: User ID not found";
        if (!req.params.postId) throw "Error: Post ID not found";
        const postId = req.params.postId;
        try {
        const like = await postData.addLike(req.session.userid, postId);
        console.log(like);
        if (!like) throw "Error: Could not add like";
        return res.status(200).json(like);
        } catch (e) {
            console.log(e);
        }
    } catch (e) {
        console.log(e); 
        return res.status(500).render('error/error', {error:e,isAuth: req.session.authenticated});
    }
});

// Route to remove like from a post
router
.route('/removeLike/:postId')
.patch(async (req, res) => {
    try {
        if (!req.session.authenticated) throw "Error: User is not authenticated";
        if (!req.session.userid) throw "Error: User ID not found";
        if (!req.params.postId) throw "Error: Post ID not found";
        const postId = req.params.postId;
        const like = await postData.removeLike(req.session.userid, postId);
        console.log(like);
        if (!like) throw "Error: Could not remove like";
        return res.status(200).json(like);
    } catch (e) {
        return res.status(500).render('error/error', {error:e,isAuth: req.session.authenticated});
    }
});

export default router
