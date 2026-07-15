import { Router } from "express";
import { uploadImages } from '../controllers/upload.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.post('/', protect, authorize('admin'), upload.array('images', 5), uploadImages);

export default router;