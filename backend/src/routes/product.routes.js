import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;