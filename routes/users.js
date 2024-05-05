/*
    ROUTES ARE NOT TESTED YET
*/
import { userData } from "../data/index.js";
import { upload } from '../middleware.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
import { ObjectId } from 'mongodb';
import { isValidId, isValidImg, isValidString, isValidUsername } from "../helpers.js";

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    try {
        // Route Will get current user profile
        if (!req.session.authenticated){
            return res.redirect('/login');
        }

        let user = await userData.getUserById(req.session.userid);
        if (!user) throw "Error: Could not get users";

        //TO-DO: change returns to render when frontend complete
        return res.status(200).render('profiles/user', {userid:req.session.userid, username: user.username, bio: user.bio, isAuth: true, isUser: true});
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).render('error/error', {error: e});
    }
})
.patch(upload.single('profile-picture'), async (req, res) => {
    console.log("Patch")
    try {
        //VALIDATION: username        
        isValidUsername(req.body.username);
        req.body.username = req.body.username.trim().toLowerCase();

    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        //VALIDATION: bios
        isValidString(req.body.bio, 0, 256);
        req.body.bio = req.body.bio.trim();
          
    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        //VALIDATION: image
        isValidImg(req.file);
    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        //VALIDATION: if user exists
        if (!req.session.authenticated) throw "Error: user must be logged in";

        const userCollection = await users();
        let user = await userCollection.find({ _id: req.session.userid});
        if (!user) throw "Error: user with id: "+ req.session.userid+" does not exist";
    } catch(e) {
        res.status(404).render('error/error', {error: e});
    }
    try {
        let updateRes = await userData.updateUser(
                                    req.session.userid,
                                    req.body.username,
                                    req.file.path,
                                    req.body.bio,
                                    );

        if (!updateRes) throw "Error: user could not be updated";  
        return res.status(200).redirect(`/users/${req.params.userid}`);

    } catch(e) {
        return res.status(500).render('error/error', {error: e});
    }
})
.delete(async (req, res) => {
     /* will delete pre-existing user */
    try {
        //VALIDATION: if user exists
        if (!req.session.authenticated) throw "Error: user must be logged in";

        const userCollection = await users();
        let user = await userCollection.find({ _id: req.session.userid});
        if (!user) throw "Error: user with id: "+req.params.userid+" does not exist";
    } catch(e) {
        return res.status(404).render('error/error', {error: e});
    }
    try {
        let deleteRes = await userData.deleteUser(req.session.userid);
        if (deleteRes==1) throw "Error: user could not be deleted";

        req.session.destroy();
        return res.status(200).send("Delete Successful");

    } catch(e) {
        console.log(e);
        return res.status(500).render('error/error', {error: e});
    }
});

router
.route('/editUser')
.get(async (req, res) => {
    if (!req.session.authenticated) throw "Error: user must be logged in";
    try {
        let user = await userData.getUserById(req.session.userid);
        return res.status(200).render('profiles/editprofile', {isAuth: req.session.authenticated, isUser: !user.isAdmin, "username": user.username, "bio": user.bio});
    } catch (e) {
        res.status(404).render('error/error', {isAuth: req.session.authenticated, error: e});
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
        return res.status(400).send(e);
    }
    try {
        let user = await userData.getUserById(req.params.userid);
        if (user == null) throw "Error: No users found with id: "+req.params.userid;;
        //TO-DO: change returns to render when frontend complete
        if(req.session.userid == req.params.userid){
            return res.status(200).render('profiles/user',{ username: user.username, bio:user.bio, userid: req.params.userid, isAuth: true,isUser: true});
        }
        if(req.session.authenticated){
            return res.status(200).render('profiles/user',{username: user.username, bio:user.bio, userid: req.params.userid, isUser: false, isAuth:true});
        }
        return res.redirect('/login');
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).render('error/error', {error: e});
    }
})

export default router