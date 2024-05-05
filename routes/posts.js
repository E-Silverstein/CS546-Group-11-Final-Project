/*
    ROUTES ARE NOT TESTED YET
*/
import { postData, algoData } from "../data/index.js";
import {posts} from "../config/mongoCollections.js";
import express from 'express';
import {ObjectId} from 'mongodb';
import {upload} from '../middleware.js';
import { isValidImg, isValidKeyword, isValidLink, isValidString, isValidId } from "../helpers.js";

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    // Route Will get all posts and create a queue for main feed
    try {
        let posts = await postData.getAllPosts();
        if (!posts) throw "Error: Could not get posts";
        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(posts);
    } catch (e) {
        return res.status(500).render('error/error', {error:e});
    }
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
       isValidImg(req.file);
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e});
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        for (let i = 0; i < req.body.clothingLinks.length ; i++) {
            let link = req.body.clothingLinks[i];
            isValidLink(link);
            req.body.clothingLinks[i] = link.trim();
        }

     } catch(e) {
        return res.status(400).render('error/error',{error:e});
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";
        
        for (let i = 0; i < req.body.keywords.length ; i++) {
            let keyword = req.body.keywords[i];
            console.log(keyword.length)
            isValidKeyword(keyword);
            req.body.keywords[i] = keyword.trim();
        }
    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    } 
    try {
         //VALIDATION: description
        isValidString(req.body.description, 5, 256);
        req.body.description = req.body.description.trim();

    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        let newPost = await postData.createPost(
                                req.session.userid,
                                '../'+req.file.path,
                                req.body.clothingLinks,
                                req.body.keywords,
                                req.body.description
                            );

        if (!newPost) throw "Error: Post could not be created"

        // will redirect to the newly created post
        return res.status(200).redirect(`/posts/${newPost._id.toString()}`)
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error:e});
    }
});

router
.route("/createPost")
.get(async(req, res) => {
    return res.status(200).render('posts/newpost');
  });

router
.route('/editPost/:postid')
.get(async (req,res) => {

    try {
        //VALIDATION: postid
        isValidId(req.params.postid)
        req.params.postid = req.params.postid.trim();

    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error', {error:e});
    }
    
    return res.status(200).render('posts/editpost', {postid: req.params.postid});
});

router
.route('/:postid')
.get(async (req, res) => {
    /* Route will get an individual post given a postid */
    try {
        //VALIDATION: postid
        isValidId(req.params.postid);
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        return res.status(400).render('error/error', {error:e});
    }
    try {
        let post = await postData.getPostById(req.params.postid);
        if (post==null) throw "Error: No Posts found with id: "+req.params.postid;;
        //TO-DO: change returns to render when frontend complete
        console.log(post.image);
        return res.status(200).render('posts/singlepost', {username: post.username, image: post.image, clothingLinks: post.clothingLinks, description: post.description});
    } catch (e) {
        return res.status(404).render('error/error', {error:e});
    }
})
.patch(upload.single('post-image'), async (req, res) => {
    /*will update a pre-existing post with new data provided from an edit form*/
    
    try {
        //VALIDATION: postid
        isValidId(req.params.postid)
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with postid: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).render('error/error', {error:e});
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});

        if (req.session.user.username != post.user) throw "Error: You do not own this post"

    } catch(e) {
        res.status(403).render('error/error', {error:e});
    }
    try {
        //VALIDATION: image 
        if (!req.file) throw "Error: Requires a 'image' input";
        if (!req.file.mimetype.includes('image/')) throw "Error: 'image' input is incorrect file type";
        
    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        //may be unnecessary: if (req.body.clothingLinks.length == 0) throw "Error: List of clothing links is empty"
        for (let i = 0; i < req.body.clothingLinks.length ; i++) {
            let link = req.body.clothingLinks[i];
            isValidLink(link);
            req.body.clothingLinks[i] = link.trim();
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e});
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";


        //may be unnecessary: if (req.body.keywords.length == 0) throw "Error: List of keywords is empty"
        for (let i = 0; i < req.body.keywords.length ; i++) {
            let keyword = req.body.keywords[i];
            isValidKeyword(keyword);
            req.body.keywords[i] = keyword.trim();
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e});
    } 
    try {
        //VALIDATION: description
       isValidString(req.body.description, 0, 256);
        req.body.description = req.body.description.trim();
   } catch(e) {
       return res.status(400).render('error/error',{error:e});
   }
    try {
       let updateRes = await postData.updatePost(req.params.postid, req.file.path, req.body.clothingLinks, req.body.keywords);
       if (updateRes == null) throw "Error: Post could not be updated"
       
       //TO-DO: change returns to render when frontend complete
        return res.status(200).redirect(`/posts/${updateRes._id.toString()}`)

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error:e});
    }
})
.delete(async (req, res) => {
    /* will delete pre-existing post */
    try {
        //VALIDATION: postid
        isValidId(req.params.postid);
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error', {error:e});
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with id: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).render('error/error', {error:e});
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        //TO-DO: initialize session state

        if (req.session.user.username != post.user) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).render('error/error', {error:e});
    }
    try {
        let deleteRes = await postData.deletePost(req.params.postid);
        if (deleteRes==1) throw "Error: Post could not be deleted";

        return res.status(200).send("Delete Successful");

    } catch(e) {
        return res.status(500).render('error/error', {error:e});
    }
});

router
.route('/getReccomendedPosts')
.get(async (req, res) => {
    /* Route will get all posts that are recommended for the user */
    try {
        let posts = await algoData.getRecommendedPosts(req.session.userid);
        if (!posts) throw "Error: Could not get posts";
        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(posts);
    } catch (e) {
        return res.status(500).render('error/error', {error:e});
    }
});

export default router
