// IDK IF NEEDED
import { keywordData } from "../data/index.js";
import express, { Router } from 'express';
const router = express.Router();

router
.route('/')
  .get(async (req, res) => {
    res.send("keywords");
    
  })

export default router