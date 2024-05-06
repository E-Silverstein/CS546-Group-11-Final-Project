import { userData } from "../data/index.js";
import { upload } from '../middleware.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
import { ObjectId } from 'mongodb';
import { isValidId, isValidBio, isValidImg, isValidString, isValidUsername } from "../helpers.js";
import xss from 'xss';

const router = express.Router();

router
.route('/')
.get(async (req, res) => {

    console.log("get request for users route")
    try {
        // Route Will get current user profile
        if (!req.session.authenticated){
            return res.redirect('/login');
        }
        let user = await userData.getUserById(req.session.userid);
        if (!user) throw "Error: Could not get users";

        console.log(user)
        //TO-DO: change returns to render when frontend complete
        return res.status(200).render('profiles/user', {userid:req.session.userid, username: user.username, bio: user.bio, isAuth: true, isUser: true, profilePicture: user.profilePicture});
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
}) // kevinthuhstink says good job :3 | :3
.patch(upload.single('profile-picture'), async (req, res) => {
    try                                                                                                {
        //VALIDATION: username        
        isValidUsername(req.body.username);
        req.body.username = xss(req.body.username.trim().toLowerCase());

    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: bios

        //console.log(req.body.bio);
        isValidBio(req.body.bio);
        req.body.bio = xss(req.body.bio.trim());
          
    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: image
        if (!req.file) {
            let user = await userData.getUserById(req.session.userid);
            if(!user) throw "Error: user does not exist";
            req.body.fileUrl = user.profilePicture;
        } else {
            isValidImg(req.file);
            req.body.fileUrl = "/"+req.file.path;
        }
        //console.log(req.body.fileUrl);
    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        //VALIDATION: if user exists
        if (!req.session.authenticated) throw "Error: user must be logged in";

        const userCollection = await users();
        let user = await userCollection.find({ _id: req.session.userid});
        if (!user) throw "Error: user with id: "+ req.session.userid+" does not exist";
    } catch(e) {
        res.status(404).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
    try {
        console.log(req.body.bio)
        let updateRes = await userData.updateUser(
                                    req.session.userid,
                                    req.body.username,
                                    req.body.fileUrl,
                                    req.body.bio,
                                    );
        if (!updateRes) throw "Error: user could not be updated";  
        return res.redirect(303, `/users`);

    } catch(e) {
        console.log(e);
        return res.status(500).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
})
.delete(async (req, res) => {
     /* will delete pre-existing user */
     console.log("delete");
    try {
        //VALIDATION: if user exists
        if (!req.session.authenticated) throw "Error: user must be logged in";

        const userCollection = await users();
        let user = await userData.getUserById(req.session.userid);
        if (!user) throw "Error: user with id: "+req.params.userid+" does not exist";
    } catch(e) {
        return res.status(404).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
    try {
        let deleteRes = await userData.deleteUser(req.session.userid);

        console.log("delete results: ", deleteRes)
        if (deleteRes==0) throw "Error: user could not be deleted";

        req.session.destroy();
        return res.status(200).send("Delete Successful");

    } catch(e) {
        console.log(e);
        return res.status(500).render('error/error', {error: e, isAuth: req.session.authenticated});
    }});

router
.route('/editUser')
.get(async (req, res) => {
    if (!req.session.authenticated) return res.status(401).render('error/error', {error: "User must be logged in"});
    try {
        let user = await userData.getUserById(req.session.userid);
        console.log(typeof user.bio);
        return res.status(200).render('profiles/editprofile', {isAuth: req.session.authenticated, isUser: !user.isAdmin, "username": user.username, "bio": user.bio});
    } catch (e) {
        console.log(e)
        return res.status(404).render('error/error', {isAuth: req.session.authenticated, error: e});
    }
})

router
.route('/:userid')
.get(async (req, res) => {
    /* Route will get an individual user given a userid */
    try {
        //VALIDATION: userid
        isValidId(req.params.userid);
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
    try {
        let user = await userData.getUserById(req.params.userid);
        if (user == null) throw "Error: No users found with id: "+req.params.userid;;
        //TO-DO: change returns to render when frontend complete
        console.log(user.posts);
        if(req.session.userid == req.params.userid){
            return res.status(200).render('profiles/user',{ username: user.username, bio:user.bio, userid: req.params.userid, isAuth: true,isUser: true, posts:user.posts});
        }
        if(req.session.authenticated){
            return res.status(200).render('profiles/user',{username: user.username, bio:user.bio, userid: req.params.userid, isUser: false, isAuth:true, posts:user.posts});
        }
        return res.status(200).redirect('/login');
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
});

export default router