import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';


export const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const filter = {};
        if(req.query.category) {
            filter.category = req.query.category;
        }
        if(req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if(req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if(req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        let sortOption = '-createdAt';
        if(req.query.sort === 'price_asc') {
            sortOption = 'price';
        }
        if(req.query.sort === 'price_desc') {
            sortOption = '-price';
        }

        const [products, total] = await Promise.all([
            Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(limit),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            products,
        });
    }catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');

        if(!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }
        
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if(!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product) {
            res.status(404);
            return next(new Error('Product not found'));
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};