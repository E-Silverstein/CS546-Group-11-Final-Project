/*
    ROUTES ARE NOT TESTED YET
*/
import { userData } from '../data/index.js';
import { users } from '../config/mongoCollections.js';
import express from 'express';
import { isValidId, isValidUsername, isValidPassword } from '../helpers.js';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    return res.status(200).render('auth/signup', {layout: 'nonav'});
})
.post(async (req, res) => {
    try {
        /*VALIDATION: username
            constraints:
            - 5-20 characters long
            - no spaces
            - no special characters
        */
        
        isValidUsername(req.body.username);
        req.body.username = req.body.username.trim().toLowerCase();

        // const userCollection = await users();
        // let user = await userCollection.findOne({username: {$eq: req.body.username}});
        let user = await userData.getUserByUsername(req.body.username);
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

        isValidPassword(req.body.password);
        if (req.body.password != req.body.confirmPassword) throw "Error: Passwords do not match";
        
    } catch(e) {
        return res.status(400).render('error/error',{error:e,layout: 'nonav'});
    }
    try {
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
                                "/uploads/default-pfp.png",
                                age,
                                "bio:"     
                            );
                                
        if (!user) throw "Error: user could not be created";
        
        return res.status(200).redirect('/login');
    } catch (e) {
         return res.status(500).render('error/error',{error:e, layout: 'nonav'});
    }

});


export default router;