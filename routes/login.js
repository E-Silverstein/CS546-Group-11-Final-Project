/*
    ROUTES ARE NOT TESTED YET
*/

import { users } from '../config/mongoCollections.js';
import express from 'express';
import bcrypt from 'bcrypt';
import xss from 'xss';
import { isValidPassword, isValidUsername } from '../helpers.js';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    return res.status(200).render('auth/signin', {layout: 'nonav'});
})



.post(async (req, res) => {
    console.log(req.body);
    try {

        
        /*VALIDATION: username
            constraints:
            - 5-20 characters long
        */
        if(!isValidUsername(req.body.username)) throw "Error: invalid username";
        req.body.username = xss(req.body.username.trim().toLowerCase());
    } catch(e) {
        return res.status(400).render('error/error',{error:e, layout: 'nonav'});
    }
    try {
        /*VALIDATION: password
            constriants:
            - at least 8 characters long
            - at least one captial letter
            - at least one number
            - at least one special character
        */
       console.log(!isValidPassword(req.body.password));
        if (!isValidPassword(req.body.password)) throw "Error: invalid password"
        req.body.password = xss(req.body.password.trim());
    } catch(e) {
        //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error: "Username or password is invalid", layout: 'nonav'});
    }
    try {
        
        const userCollection = await users();
        let user = await userCollection.findOne({username: req.body.username});
        if (!user) throw "Username or Password is invalid.";
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (!compare) throw "Username or password is invalid."; 
        console.log(user);
        req.session.userid = user._id;
        req.session.isAdmin = user.isAdmin;
        req.session.authenticated = true && !user.banned;

        return res.status(200).redirect('/home');
    } catch (e) {
         //TO-DO: change returns to render when frontend complete
        return res.status(400).render('error/error',{error: "Username or password is invalid", layout: 'nonav'});
    }
});

export default router;