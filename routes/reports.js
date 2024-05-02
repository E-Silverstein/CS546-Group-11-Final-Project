// IDK IF NEEDED
import { reportData } from "../data/index.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/') 
    .get(async (req, res) => {
        res.send("reports");
    });

router
.route('/:reportid')
.get(async (req, res) => {
    res.send("get report page");
})
.post(async (req, res) => {
    res.send("create report page");
})
.patch(async (req, res) => {
    res.send("edit report page");
})
.delete(async (req, res) => {
    res.send("delete report page");
});

export default router