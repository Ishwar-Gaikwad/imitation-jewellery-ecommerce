import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort('name');
        res.status(200).json({ success: true, count: categories.length, categories });
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isValidObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const category = isValidObjectId
      ? await Category.findById(idOrSlug)
      : await Category.findOne({ slug: idOrSlug });

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

//Create
export const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, category });
    } catch (error) {
        next(error);
    }
};

//Update
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

//delete

export const deleteCategory = async (req, res, next) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });

        if(productCount > 0) {
            res.status(400);
            return next(
                new Error(
                    `Cannot delete category - ${productCount} products still reference it. Reassign or delete thode products first.`
                )
            );
        }

        const category = await Category.findById(req.params.id);

        if(!category) {
            res.status(404);
            return next(new Error('Category not found'));
        }

        res.status(200).json({ success: true, message: 'Category deleted successfully '});
    } catch (error) {
        next(error);
    }
};
