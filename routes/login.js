/*
    ROUTES ARE NOT TESTED YET
*/

import { users } from '../config/mongoCollections.js';
import express from 'express';
import bcrypt from 'bcrypt';
import { isValidPassword, isValidUsername } from '../helpers.js';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    return res.status(200).render('auth/signin', {layout: 'nonav'});
})
.post(async (req, res) => {
    try {
        /*VALIDATION: username
            constraints:
            - 5-20 characters long
        */
        isValidUsername(req.body.username);
        req.body.username = req.body.username.trim().toLowerCase();
    } catch(e) {
        return res.status(400).render('error/error',{error:e});
    }
    try {
        /*VALIDATION: password
            constriants:
            - at least 8 characters long
            - at least one captial letter
            - at least one number
            - at least one special character
        */
        isValidPassword(req.body.password);
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e});
    }
    try {
        
        const userCollection = await users();
        let user = await userCollection.findOne({username: req.body.username});
        if (!user) throw "Username or Password is invalid.";
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) throw "Username or password is invalid."; 

        req.session.userid = user._id;
        req.session.isAdmin = user.isAdmin;
        req.session.authenticated = true;


        return res.status(200).redirect('/home');
    } catch (e) {
         //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error:e});
    }
});

export default router;