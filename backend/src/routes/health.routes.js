import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestrap: new Date().toISOString(),
    });
});

export default router;