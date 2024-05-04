/*
    ROUTES ARE NOT TESTED YET
*/

import { users } from '../config/mongoCollections.js';
import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    return res.status(200).render('auth/signin');
})
.post(async (req, res) => {
    try {
        /*VALIDATION: username
            constraints:
            - 5-20 characters long
        */
       
        console.log(req.body.username);
        if (!req.body.username) throw "Error: Requires a 'username' input";
        if (typeof req.body.username != 'string') throw "Error: 'username' must be a string";
        if (req.body.username.trim() == "") throw "Error: 'username' is an empty string";

        req.body.username = req.body.username.trim().toLowerCase();

        if (req.body.username.length < 5 || req.body.username.length > 20) throw  "Username or Password is invalid.";
        if (req.body.username.match(' ') != null) throw "Username or Password is invalid.";;
        if (req.body.username.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g) != null) throw "Error: username cannot have special characters";

    } catch(e) {
        return res.status(400).send(e);
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
        
        if (req.body.password.length < 8 || req.body.password.length > 32) throw "Username or Password is invalid.";
        if (req.body.password.match(/[0-9]/g) == null) throw "Username or Password is invalid.";
        if (req.body.password.match(/[A-Z]/g) == null) throw "Username or Password is invalid.";
        if (req.body.password.match(/[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/g) == null) throw "Username or Password is invalid.";
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        
        const userCollection = await users();
        let user = await userCollection.findOne({username: req.body.username});
        if (!user) throw "Username or Password is invalid.";
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) throw "Username or password is invalid."; 

        req.session.user = user;
        req.session.authenticated = true;

        console.log(req.session);
        return res.status(200).redirect('home');
    } catch (e) {
         //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
});

export default router;