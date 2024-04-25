/*
    ROUTES ARE NOT TESTED YET
*/
import { getAllUsers, create, getUserById } from '../data/users.js';
import { upload } from '../middleware.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    try {
        // Route Will get all users 
        let users = await getAllUsers();
        if (!users) throw "Error: Could not get users";

        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(users);
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(500).send(e)
    }
})
.post('/signup',upload.single('profile-picture'),async (req, res) => {
    /* Will get data from creation form and create a user if valid arguments */
    try {
        //VALIDATION: username
        
        if (!req.body.username) throw "Error: Requires a 'username' input";
        if (typeof req.body.username != 'string') throw "Error: 'username' must be a string";
        if (req.body.username.trim() == "") throw "Error: 'username' is an empty string";

        req.body.username =  req.body.username.trim().toLowercase();

        if (req.body.username.length < 5 || req.body.username.length > 20) throw "Error: 'username' does not meet length constraints (5-20 characters)";
        if (req.body.password.match(' ') != null) throw "Error: 'username' cannot contain spaces";

        let userCollection = await users();
        let user = await userCollection.findOne({username : {$eq: req.body.username}});
        if (user) throw "Error: User with username '" + req.body.username + "' already exists";
    } catch(e) {
        res.status(400).send(e);
    }
    try {
        /*VALIDATION: password
            constriants:
            - at least 8 characters long
            - at least one captial letter
            - at least one number
            - at least one special character
        */
        if (!req.body.password) throw "Error: Requires a 'password' input";
        if (typeof req.body.password != 'string') throw "Error: 'password' must be a string";
        if (req.body.password.trim() == "") throw "Error: 'password' is an empty string";

        if (req.body.password.length < 8) throw "Error: 'password' does not meet length constraints (at least 8 characters)";
        if (req.body.password.match(/[0-9]/g) == null) throw "Error: Password must contain at least one number";
        if (req.body.password.match(/[A-Z]/g) == null) throw "Error: Password must contain at least one uppercase character";
        if (req.body.password.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g) == null) throw "Error: Password must contain at least one special character"; 

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        //VALIDATION: profile picture
        if (!req.file) throw "Error: Requires a 'profile-picture' input";
        if (!req.file.mimetype.includes('image/')) throw "Error: 'profile-picture' input is incorrect file type";

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        if (!req.body.age) throw "Error: Requires an 'age' input";
        if (typeof req.body.age != 'number') throw "Error: 'age' must be a string";
        if (req.body.age < 13) throw "Error: must be at least 13 years old";
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        let createRes = await create(
                                req.body.username,
                                req.body.password,
                                req.file.path,
                                req.body.age,
                                new Date()
                            )
        if (createRes!=0) throw "Error: user could not be created";
        
        //TO-DO: change returns to render when frontend complete
        return res.status(200).send("User successfully created");
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
});

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
        let post = await getUserById(req.params.userid);
        if (post==null) throw "Error: No Posts found with id: "+req.params.userid;;
        //TO-DO: change returns to render when frontend complete
        return res.status(200).json(post);
    } catch (e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(404).send(e);
    }
})
.patch(upload.single('profile-picture'), async (req, res) => {
    /*will update a pre-existing user with new data provided from an edit form*/
    //TO-DO
})
.delete(async (req, res) => {
     /* will delete pre-existing user */
    try {
        //VALIDATION: userid
        if (req.params.userid == null) throw "Error: Requires a 'postid' input";
        if (typeof req.params.userid != 'string') throw "Error: 'postid' must be a string";
        if (req.params.userid.trim() == '') throw "Error: 'postid' cannot be an empty string";
        if(!ObjectId.isValid(req.params.userid)) throw "Error: 'postid' is not a valid ObjectId";
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
        res.status(404).send(e);
    }
    try {
        //VALIDATION: if user is current user
        const userCollection = await users();
        let post = await userCollection.find({ _id: new ObjectId(req.params.userid)});

        //TO-DO: initialize session state and compare users
        //if (req.session.user.name != user.username) throw "Error: You do not own this post"
    } catch(e) {
        res.status(403).send(e);
    }
    try {
        let deleteRes = await deleteUser(req.params.userid);
        if (deleteRes==1) throw "Error: Post could not be deleted";

        return res.status(200).send("Delete Successful");

    } catch(e) {
        return res.status(500).send(e);
    }
});


export default router