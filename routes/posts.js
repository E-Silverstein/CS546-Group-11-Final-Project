/*
    ROUTES ARE NOT TESTED YET
*/
import { postData } from "../data/index.js";
import {posts} from "../config/mongoCollections.js";
import express from 'express';
import {ObjectId} from 'mongodb';
import {upload} from '../middleware.js';

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
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e);
    }
})
// upload.single('name') takes in the name of the INPUT ELEMENT that the file is being inputted to
.post(upload.single('post-image'), async (req, res) => {
    console.log("posts");
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
        console.log('file');
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: clothingLinks
        if (!req.body.clothingLinks) throw "Error: Requires a list of 'clothing link' input";
        if (typeof req.body.clothingLinks != 'string' ) throw "Error: 'clothing link' must be a string";
        if (req.body.clothingLinks.trim() == '') throw "Error: 'clothing link' cannot be an empty an be a string";

        let linksList = (req.body.clothingLinks).split(', ');

        for (let i = 0; i < linksList.length ; i++) {
            let link = linksList[i];
            if (link.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) == null) throw "Error: Invalid link";
        }

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
        //VALIDATION: keywords
        if (!req.body.keywords) throw "Error: Requires a list of 'keywords' input";
        
        let keywordsList = (req.body.keywords).split(', ');

        for (let i = 0; i < keywordsList.length ; i++) {
            let keyword = keywordsList[i];
            if (typeof keyword != 'string') throw "Error: 'keyword' must be a string";
            if (keyword.trim() =='') throw "Error: 'keyword' cannot be empty string";
            keywordsList[i] = keyword.trim();
        }

        req.body.keywords = keywordsList;

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    } 
    try {
         //VALIDATION: description
         if (req.body.description == null) throw "Error: Requires a 'description' input";
         if (typeof req.body.description != 'string') throw "Error: 'description' must be a string";
         if (req.body.description.trim() == '') throw "Error: 'description' cannot be an empty string";
         req.body.description = req.body.description.trim();

         if ( req.body.description.length < 5 ||  req.body.description.length > 256) throw "Error: 'description' does not meet length constriants";
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        let newPost = await postData.createPost(
                                req.session.user._id,
                                req.file.path,
                                req.body.clothingLinks,
                                req.body.keywords,
                                req.body.description
                            );

        if (!newPost) throw "Error: Post could not be created"

        // will redirect to the newly created post
        return res.status(200).redirect(`/posts/${newPost._id.toString()}`)
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        console.log(e)
        return res.status(500).send(e);
    }
});

router
.route('/editPost/:postid')
.get(async (req,res) => {

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
    
    return res.status(200).render('test_editPost', {postid: req.params.postid});
});

router
.route('/createPost')
.get(async (req, res) => {
    return res.status(200).render('posts/newpost');
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
        let post = await postData.getPostById(req.params.postid);
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
        console.log(e);
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if post exists
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});
        if (!post) throw "Error: Post with postid: "+req.params.postid+" does not exist"
    } catch(e) {
        console.log(e);
        res.status(404).send(e);
    }
    try {
        //VALIDATION: if user owns post
        const postCollection = await posts();
        let post = await postCollection.find({ _id: new ObjectId(req.params.postid)});

        if (req.session.user.username != post.user) throw "Error: You do not own this post"

    } catch(e) {
        console.log(e);
        res.status(403).send(e);
    }
    try {
        //VALIDATION: image 
        if (!req.file) throw "Error: Requires a 'image' input";
        if (!req.file.mimetype.includes('image/')) throw "Error: 'image' input is incorrect file type";
        
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        console.log(e);
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
        //VALIDATION: description
        if (req.body.description == null) throw "Error: Requires a 'description' input";
        if (typeof req.body.description != 'string') throw "Error: 'description' must be a string";
        if (req.body.description.trim() == '') throw "Error: 'description' cannot be an empty string";
        req.body.description = req.body.description.trim();

        if (description.length < 0 || description.length > 256) throw "Error: 'description' does not meet length constriants";
   } catch(e) {
       return res.status(400).send(e);
   }
    try {
       let updateRes = await postData.updatePost(req.params.postid, req.file.path, req.body.clothingLinks, req.body.keywords);
       if (updateRes == null) throw "Error: Post could not be updated"
       
       //TO-DO: change returns to render when frontend complete
        return res.status(200).redirect(`/posts/${updateRes._id.toString()}`)

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

        if (req.session.user.username != post.user) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).send(e);
    }
    try {
        let deleteRes = await postData.deletePost(req.params.postid);
        if (deleteRes==1) throw "Error: Post could not be deleted";

        return res.status(200).send("Delete Successful");

    } catch(e) {
        return res.status(500).send(e);
    }
});

export default router