/*
    ROUTES ARE NOT TESTED YET
*/
import {deletePost, getAllPosts, getPostById, updatePost} from "./../data/posts.js";
import {posts} from "./../config/mongoCollections.js";
import express from 'express';
import {ObjectId} from 'mongodb';
import {upload} from './../middleware.js';

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    // Route Will get all posts and create a queue for main feed
    try {
        let posts = await getAllPosts();
        if (!posts) throw "Error: Could not get posts";
        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(posts);
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e);
    }
})
// upload.single('name') takes in the name of the INPUT ELEMENT that the file is being inputted to
.post(upload.single('image'), async (req, res) => {
    /* Will get data from creation form and create a post if valid arguments */
    try {
        //VALIDATION: user -> should later be validated using the session state
        if (!req.body.user) throw "Error: Requires a 'user' input";
        if (typeof req.body.user != 'string') throw "Error: 'user' input must be a string";
        if (req.body.user.trim() =='') throw "Error: 'user' cannot be empty string";
        req.body.user = req.body.user.trim();

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: image 
        /*multer will send file information to req.file
            important attributes:
            - fieldname: input element name
            - mimetype: type of file
        */
        if (!req.file) throw "Error: Requires a 'image' input";
        if (!req.file.mimetype.includes('image/')) throw "Error 'image' input is incorrect file type";
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        //may be unnecessary: if (req.body.clothingLinks.length == 0) throw "Error: List of clothing links is empty"
        for (let i = 0; i < req.body.clothingLinks.length ; i++) {
            let link = req.body.clothingLinks[i];
            if (typeof link != 'string') throw "Error: 'clothing link' must be a string";
            if (link.trim() =='') throw "Error: 'clothing link' cannot be empty string";
            req.body.clothingLinks[i] = link.trim();
            
            let split_link = link.split('.');
            if (split_link[0] != 'https://' || split_link[split_link.length-1] != '.com') throw "Error: Invalid clothing link: "+link;
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";
        //may be unnecessary: if (req.body.keywords.length == 0) throw "Error: List of keywords is empty"
        for (let i = 0; i < req.body.keywords.length ; i++) {
            let keyword = req.body.keywords[i];
            if (typeof keyword != 'string') throw "Error: 'keyword' must be a string";
            if (keyword.trim() =='') throw "Error: 'keyword' cannot be empty string";
            req.body.keywords[i] = link.trim();
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        let newPost = await create(
                                req.body.user,
                                req.file.path,
                                req.body.clothingLinks,
                                req.body.keywords
                            );
        if (!newPost) throw "Error: Post could not be created"

        //TO-DO: change returns to render when frontend complete
        res.status(200).send(newPost)
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e);
    }
});
router
.route('/:postid')
.get(async (req, res) => {
    /* Route will get an individual post given a postid */
    try {
        //VALIDATION: postid
        if (req.params.postid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.postid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.postid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.postid)) throw "Error: 'postid' is not a valid ObjectId";
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        let post = await getPostById(req.params.postid);
        if (post==null) throw "Error: No Posts found with id: "+req.params.postid;;
        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(post);
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).send(e);
    }
})
.patch(upload.single('image'), async (req, res) => {
    /*will update a pre-existing post with new data provided from an edit form*/
    
    try {
        //VALIDATION: postid
        if (req.params.postid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.postid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.postid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.postid)) throw "Error: 'postid' is not a valid ObjectId";
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with postid: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).send(e);
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        //TO-DO: initialize session state
        //if (req.session.user.name != post.user) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).send(e);
    }
    try {
        //VALIDATION: image 
        if (!req.file) throw "Error: Requires a 'image' input";
        if (!req.file.mimetype.includes('image/')) throw "Error: 'image' input is incorrect file type";
        
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        //may be unnecessary: if (req.body.clothingLinks.length == 0) throw "Error: List of clothing links is empty"
        for (let i = 0; i < req.body.clothingLinks.length ; i++) {
            let link = req.body.clothingLinks[i];
            if (typeof link != 'string') throw "Error: 'clothing link' must be a string";
            if (link.trim() =='') throw "Error: 'clothing link' cannot be empty string";
            req.body.clothingLinks[i] = link.trim();
            
            let split_link = link.split('.');
            if (split_link[0] != 'https://' || split_link[split_link.length-1] != '.com') throw "Error: Invalid 'clothing link': "+link;
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";
        //may be unnecessary: if (req.body.keywords.length == 0) throw "Error: List of keywords is empty"
        for (let i = 0; i < req.body.keywords.length ; i++) {
            let keyword = req.body.keywords[i];
            if (typeof keyword != 'string') throw "Error: 'keyword' must be a string";
            if (keyword.trim() =='') throw "Error: 'keyword' cannot be empty string";
            req.body.keywords[i] = link.trim();
        }
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
       let updateRes = await updatePost(req.params.postid, req.file.path, req.body.clothingLinks, req.body.keywords);
       if (updateRes == 0) throw "Error: Post could not be updated"
       
       //TO-DO: change returns to render when frontend complete
        return res.status(200).send("Update Successful");

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e);
    }
})
.delete(async (req, res) => {
    /* will delete pre-existing post */
    try {
        //VALIDATION: postid
        if (req.params.postid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.postid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.postid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.postid)) throw "Error: 'postid' is not a valid ObjectId";
        req.params.postid = req.params.postid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with id: "+req.params.postid+" does not exist"
    } catch(e) {
        res.status(404).send(e);
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        //TO-DO: initialize session state
        //if (req.session.user.name != post.user) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).send(e);
    }
    try {
        let deleteRes = await deletePost(req.params.postid);
        if (deleteRes==1) throw "Error: Post could not be deleted";


        return res.status(200).send("Delete Successful");

    } catch(e) {
        return res.status(500).send(e);
    }
});

export default router