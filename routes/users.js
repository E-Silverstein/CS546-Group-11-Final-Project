/*
    ROUTES ARE NOT TESTED YET
*/
import { userData } from "../data/index.js";
import { upload } from '../middleware.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    try {
        // Route Will get all users 
        let users = await userData.getAllUsers();
        if (!users) throw "Error: Could not get users";

        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(users);
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e)
    }
})

router
.route('/editUser/:userid')
.get(async (req, res) => {
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'userid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'userid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'userid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'userid' is not a valid ObjectId";
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    return res.status(200).render('profiles/editprofile', {'userid': req.params.userid});
})

router
.route('/:userid')
.get(async (req, res) => {
    /* Route will get an individual user given a userid */
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'userid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'userid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'userid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'userid' is not a valid ObjectId";
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        let user = await userData.getUserById(req.params.userid);
        if (user == null) throw "Error: No users found with id: "+req.params.userid;;
        //TO-DO: change returns to render when frontend complete
        return res.status(200).render('profiles/user', user);
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).send(e);
    }
})
.patch(upload.single('profile-picture'), async (req, res) => {
    console.log("Patch");
    /*will update a pre-existing user with new data provided from an edit form*/
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'userid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'userid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'userid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'userid' is not a valid ObjectId";
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: username
        if (!req.body.username) throw "Error: Requires a 'username' input";
        if (typeof req.body.username != 'string') throw "error: 'username must be a string";
        if (req.body.username.trim() == "") throw "Error: 'username' is an empty input";

        req.body.username =  req.body.username.trim().toLowerCase();

        if (req.body.username.length < 5 || req.body.username.length > 32) throw "Error: 'username' does not meet length constraints (5-20 characters)";
        if (req.body.username.match(' ') != null) throw "Error: 'username' cannot contain spaces";
          
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: bios
        if (!req.body.bio) throw "Error: Requires a 'username' input";
        if (typeof req.body.bio != 'string') throw "error: 'username must be a string";
        if (req.body.bio.trim() == "") throw "Error: 'username' is an empty input";

        req.body.bio =  req.body.bio.trim().toLowerCase();

        if (req.body.bio.length < 0 || req.body.bio.length > 256) throw "Error: 'username' does not meet length constraints (5-20 characters)";
        if (req.body.bio.match(' ') != null) throw "Error: 'username' cannot contain spaces";
          
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: image
        if (!req.file) throw "Error: Requires an 'image' input";
        if (!req.file.mimetype.includes("image/")) throw "error: 'image' is incorrect file type";
       
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if user exists
        const userCollection = await users();
        let user = await userCollection.find({ _id: new ObjectId(req.params.userid)});
        if (!user) throw "Error: user with id: "+req.params.userid+" does not exist";
    } catch(e) {
        res.status(404).send(e);
    }
    try {
        //VALIDATION: if user is current user
        const userCollection = await users();
        let user = await userCollection.find({ _id: new ObjectId(req.params.userid)});

        //TO-DO: doesnt work, need middle wares
        if (req.session.user.username != user.username) throw "Error: you are not this user";
    } catch(e) {
        return res.status(403).send(e);
    }
    try {
        let updateRes = await userData.updateUser(
                                    req.params.userid,
                                    req.body.username,
                                    req.file.path,
                                    req.body.bio,
                                    );

        if (!updateRes) throw "Error: user could not be updated";  
        return res.status(200).redirect(`/users/${req.params.userid}`);

    } catch(e) {
        console.log(e)
        
        return res.status(500).send(e);
    }

})
.delete(async (req, res) => {
     /* will delete pre-existing user */
     console.log("delete")
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'userid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'userid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'userid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'userid' is not a valid ObjectId";
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: if user exists
        const userCollection = await users();
        let user = await userCollection.find({ _id: new ObjectId(req.params.userid)});
        if (!user) throw "Error: user with id: "+req.params.userid+" does not exist";
    } catch(e) {
        return res.status(404).send(e);
    }
    try {
        //VALIDATION: if user is current user
        const userCollection = await users();
        let user = await userCollection.find({ _id: new ObjectId(req.params.userid)});

        //TO-DO: initialize session state and compare users
        //if (req.session.user.username != user.username) throw "Error: You do not own this user"
    } catch(e) {
        return res.status(403).send(e);
    }
    try {
        let deleteRes = await userData.deleteUser(req.params.userid);
        if (deleteRes==1) throw "Error: user could not be deleted";

        return res.status(200).send("Delete Successful");

    } catch(e) {
        console.log(e);
        return res.status(500).send(e);
    }
});


export default router