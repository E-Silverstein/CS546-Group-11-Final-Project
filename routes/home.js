import { Router } from "express";
let router = Router();

router.get("/", async (req, res) => {
    res.render('home');
});

export default router;