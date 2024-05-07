/*
    ROUTES ARE NOT TESTED YET
*/
import { userData } from '../data/index.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
import { isValidId, isValidUsername, isValidPassword } from '../helpers.js';
import xss from 'xss';
const router = express.Router();


router
.route('/')
.get(async (req, res) => {
    let message = req.query.message;
    req.query.message = {};
    return res.status(200).render('auth/signup', {layout: 'nonav', 'message': message});
})
.post(async (req, res) => {
    try {
        /*VALIDATION: username
            constraints:
            - 5-20 characters long
            - no spaces
            - no special characters
        */
        
        if(!isValidUsername(req.body.username)) throw "Error: invalid username";
        req.body.username = xss(req.body.username.trim().toLowerCase());

        const userCollection = await users();
        let user = await userCollection.findOne({username: {$eq: req.body.username}});
        if (user) throw "Error: Username "+req.body.username+" already exists";

    } catch(e) {
        return res.status(400).render('error/error',{error:e, isAuth: req.session.authenticated});
    }
    try {
        /*VALIDATION: password
            constriants:
            - at least 8 characters long and shorter than 20 characters
            - at least one captial letter
            - at least one number
            - at least one special character
        */

        if(!isValidPassword(req.body.password)) throw "error: invalid password";
        req.body.password = xss(req.body.password.trim());
        req.body.confirmPassword = xss(req.body.confirmPassword.trim());
        if (req.body.password != req.body.confirmPassword) throw "Error: Passwords do not match";
        
    } catch(e) {
        return res.status(400).render('error/error',{error:e,layout: 'nonav'});
    }
    try {
        req.body.birthdate = xss(req.body.birthdate.trim());
        let birthYear = parseInt(req.body.birthdate.substring(0,4));
        let currYear = new Date().getFullYear();
        if (currYear - birthYear < 13) throw "Error: must be at least 13 years old";
    } catch(e) {
         return res.status(400).render('error/error',{error:e, layout: 'nonav'});
    }
    try {
        let birthYear = parseInt(req.body.birthdate.substring(0,4));
        let currYear = new Date().getFullYear();
        let age = currYear - birthYear;
                
        let user = await userData.createUser(
                                req.body.username,
                                req.body.password,
                                "/uploads/default-pfp.jpeg",
                                age,
                                ""     
                            );
          
        console.log(user);
        if (!user) throw "Error: user could not be created";
        
        return res.status(200).redirect('/login');
    } catch (e) {
         return res.status(500).render('error/error',{error:e, layout: 'nonav'});
    }

});


export default router;