import { postData, userData } from "../data/index.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
    .get(async (req, res) => {
        // TODO: Change, when search page is made, to actual location
        return res.render("search");
    })
    .post(async (req, res) => {
        const { keywords } = req.body;
        const { query } = req.body;

        if(!(keywords && query)) {
            return res.status(400).render("search", { error: "Please provide at least 1 keyword and/or a query.", isAuth: req.session.authenticated });
        }

        if(!Array.isArray(keywords)) {
            return res.status(400).render("search", { error: "Keywords must be an array of strings.", isAuth: req.session.authenticated });
        }
        if(typeof query !== 'string') {
            return res.status(400).render("search", { error: "Query must be a string.", isAuth: req.session.authenticated });
        }

        keywords.forEach(kw => {
            if(typeof kw !== 'string') {
                return res.status(400).render("search", { error: "Keywords must be an array of strings.", isAuth: req.session.authenticated });
            }
        });

        keywords = keywords.map(kw => { 
            kw.trim(); 
            kw.toLowerCase(); 
        });
        query = query.trim();

        let renderData = {};
        try {
            let posts = [];
            keywords.forEach(async kw => posts.push(await postData.getPostsByKeyword(kw)));
            renderData.posts = posts;
        } catch(e) {
            renderData.posts = [];
        }
        try {
            let users = await userData.searchUserByUsername(query);
            renderData.users = users;
        } catch(e) {
            renderData.users = null;
        }
        
        return res.status(200).render("search", renderData);
    });

export default router;