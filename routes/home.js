import { Router } from "express";
let router = Router();

router.get("/", async (req, res) => {
    res.render('auth/home');
});

export default router;