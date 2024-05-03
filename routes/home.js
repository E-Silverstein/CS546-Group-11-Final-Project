import { Router } from "express";
let router = Router();

router.get("/", async (req, res) => {
    res.render('home/home');
});

export default router;