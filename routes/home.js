import { Router } from "express";
let router = Router();

router
.route("/")
.get((req, res) => {
    try{
        if(req.session.authenticated){
            return res.render('home/home', {isAuth: true, userid: req.session.user._id});
        }
        return res.render('home/home', {isAuth: false});
    } catch(e){
        return res.render('error/error', {error: e});
    }
    
});

export default router;