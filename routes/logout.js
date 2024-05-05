import Router from 'express';
const router = Router();

router.route('/')
.get(async (req, res) => {
    try {
        req.session.destroy();
        return res.status(200).redirect('/login');
    } catch (e) {
        return res.status(500).render('error/error', {error: e});
    }
});

export default router;