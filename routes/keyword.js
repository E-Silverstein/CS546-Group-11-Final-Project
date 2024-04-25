// IDK IF NEEDED
import * as keywordData from "../data/keyword.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
  .get(async (req, res) => {
    res.send("keywords");
    
  })

export default router