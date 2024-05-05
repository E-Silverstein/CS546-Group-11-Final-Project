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
        isValidId(req.params.userid);
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
        isValidId(req.params.userid);
        req.params.userid = req.params.userid.trim();
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: username        
        isValidUsername(req.body.username);
        req.body.username = req.body.username.trim().toLowerCase();

    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: bios
        isValidString(req.body.bio, 0, 256);
        req.body.bio = req.body.bio.trim();
          
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: image
        isValidImg(req.file);
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
       isValidId(req.params.userid);
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