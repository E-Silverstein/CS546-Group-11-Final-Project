import * as keywordData from "../data/keyword.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    res.send("users");
});

router
.route('/:userid')
.get(async (req, res) => {
    res.send("user profile page");
})
.post(async (req, res) => {
    res.send("user signup page");
})
.patch(async (req, res) => {
    res.send("user edit page");
})
.delete(async (req, res) => {
    res.send("user delete page");
});


export default router