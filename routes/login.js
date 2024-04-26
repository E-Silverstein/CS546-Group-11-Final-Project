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

    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).send(e);
    }
    try {
        
        const userCollection = await users();
        let user = await userCollection.findOne({username: req.body.username});
        console.log(user.password);
        console.log(req.body.password);
        if (!user) throw "Username is invalid.";
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) throw "password is invalid."; 

        req.session.user = user;
        req.session.authenticated = true;

        return res.status(200).send("login succesful");
    } catch (e) {
         //TO-DO: change returns to render when frontend complete
         console.log('valdiation')
        return res.status(400).send(e);
    }

});


export default router;