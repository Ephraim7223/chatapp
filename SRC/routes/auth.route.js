import express from 'express';
import { signup, signin, refreshToken, logout } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middlewares/jwt.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', signin);
router.post('/refresh', refreshToken);
router.post('/logout', protectedRoute, logout);

router.get('/me', protectedRoute, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

export default router;