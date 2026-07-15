import { Router } from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getCategories);
router.get('/:idOrSlug', getCategory);

router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
