import { Router } from "express";
let router = Router();

router
.route("/")
.get((req, res) => {
    if(req.session.authenticated){
        return res.render('home/home', {isAuth: true});
    }
    return res.render('home/home', {isAuth: false});
});

export default router;