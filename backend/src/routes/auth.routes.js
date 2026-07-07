import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', protect, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

router.get('/admin-only', protect, authorize('admin'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, admin!'});
});

export default router;