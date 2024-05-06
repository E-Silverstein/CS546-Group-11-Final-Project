// IDK IF NEEDED
import { commentData } from "../data/index.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
.get(async (req, res) => {
    res.send("comments");
  });

router
.route('/:commentid')
.get(async (req, res) => {
    res.send("report page");
})
.post(async (req, res) => {
    res.send("report create page");
})
.patch(async (req, res) => {
    res.send("report edit page");
})
.delete(async (req, res) => {
    res.send("report delete page");
});


export default router