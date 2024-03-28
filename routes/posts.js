import * as postData from "../data/keyword.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
res.send("posts");
});

router
.route('/:postid')
.get(async (req, res) => {
    res.send("post page");
})
.post(async (req, res) => {
    res.send("post create page");
})
.patch(async (req, res) => {
    res.send("post edit page");
})
.delete(async (req, res) => {
    res.send("post delete page");
});

  

export default router