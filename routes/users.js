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
        return res
          .status(200)
          .render("profiles/user", {
            userid: req.session.userid,
            username: user.username,
            bio: user.bio,
            isAuth: true,
            isUser: true,
            profilePicture: user.profilePicture,
            posts: user.posts,
            followingCount: user.following.length,
            followerCount: user.followers.length,
          });
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
        return res.status(200).render('profiles/editprofile', {isAuth: req.session.authenticated, isUser: !user.isAdmin, "username": user.username, "bio": user.bio, profilePicture: user.profilePicture});
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

        let followingCount = user.following.length;
        let followerCount = user.followers.length;

        let isFollowing = false;
        for (let i = 0; i < user.followers.length; i++) {
            if (user.followers[i].toString() === req.session.userid) {
                isFollowing = true;
                break;
            }
        }

        //TO-DO: change returns to render when frontend complete
        console.log(user.posts);
        if(req.session.userid == req.params.userid){
            return res.status(200).render('profiles/user',{ username: user.username, bio:user.bio, userid: req.params.userid, isAuth: true,isUser: true, profilePicture: user.profilePicture, followingCount: followingCount, followerCount: followerCount, posts: user.posts});
        }
        if(req.session.authenticated){
            return res.status(200).render('profiles/user',{username: user.username, bio:user.bio, userid: req.params.userid, isUser: false, isAuth:true, profilePicture: user.profilePicture, followingCount: followingCount, followerCount: followerCount, isFollowing: isFollowing, posts: user.posts});
        }
       
        return res.status(200).redirect('/login');
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
});

// Route to add a follower
router
.route('/follow/:username')
.patch(async (req, res) => {
    try {
        if (!req.session.authenticated) throw "Error: User must be logged in";
        if (!req.session.userid) throw "Error: User ID not found";
        if (!req.params.username) throw "Error: User ID not found in parameters";
    
        const userCollection = await users();
        const user = await userCollection.findOne({ username: req.params.username });
        if (!user) throw "Error: User with username: " + req.params.username + " does not exist";
        
        try {
            const follower = await userData.addFollower(user._id.toString(), req.session.userid);
            console.log(follower);
            if (!follower) throw "Error: Could not add follower";
            return res.status(200).send("Follower added successfully");
        } catch (e) {
            console.log(e);
            throw e;
        }
    } catch (e) {
        console.log(e);
        return res.status(500).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
});

// Route to remove a follower
router
.route('/unfollow/:username')
.patch(async (req, res) => {
    try {
        if (!req.session.authenticated) throw "Error: User must be logged in";
        if (!req.session.userid) throw "Error: User ID not found";
        if (!req.params.username) throw "Error: Username not found in parameters";
        console.log("username: ", req.params.username);
        console.log("userid: ", req.session.userid);
        const userCollection = await users();
        const user = await userCollection.findOne({ username: req.params.username });
        if (!user) throw "Error: User with username: " + req.params.username + " does not exist";
        
        try {
            const followerRemoved = await userData.removeFollower(user._id.toString(), req.session.userid);
            console.log(followerRemoved);
            if (!followerRemoved) throw "Error: Could not remove follower";
            return res.status(200).send("Follower removed successfully");
        } catch (e) {
            console.log(e);
            throw e;
        }
    } catch (e) {
        console.log(e);
        return res.status(500).render('error/error', {error: e, isAuth: req.session.authenticated});
    }
});


export default router