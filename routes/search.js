import { postData, userData } from "../data/index.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
    .get(async (req, res) => {
        res.render("search");
    })
    .post(async (req, res) => {
        const { keywords } = req.body;
        const { query } = req.body;

        if(!(keywords && query)) {
            return res.status(400).render("search", { error: "Please provide at least 1 keyword and/or a query." });
        }

        if(!Array.isArray(keywords)) {
            return res.status(400).render("search", { error: "Keywords must be an array of strings." });
        }
        if(typeof query !== 'string') {
            return res.status(400).render("search", { error: "Query must be a string." });
        }

        keywords.forEach(kw => {
            if(typeof kw !== 'string') {
                return res.status(400).render("search", { error: "Keywords must be an array of strings." });
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
        
        res.render("search", renderData);
    });

export default router;