import { Router } from "express";
let router = Router();

router.get("/", async (req, res) => {
    res.render('auth/signin');
});

export default router;