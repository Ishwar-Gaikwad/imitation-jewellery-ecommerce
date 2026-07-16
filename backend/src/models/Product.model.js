import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },

        description: {
            type: String,
            required: [true, 'Product description is required'],
        },

        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        discountPrice: {
            type: Number,
            min: [0, 'Discount price cannot be negative'],
            validate: {
                validator: function (value) {
                if (value == null) return true;

                const price = typeof this.getUpdate === 'function'
                    ? this.getUpdate().price
                    : this.price;

                return price == null || value < price;
                },
                message: 'Discount price must be less than the regular price',
            },
},

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },

        images: {
            type: [String],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'At least one product image is required',
            },
        },

        stock: {
            type: Number,
            required: true,
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },

        material: {
            type: String,
            trim: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },

    {
        timestamps: true,
    }

    
);



productSchema.index({ name: 'text', description: 'text'});
const Product = mongoose.model('Product', productSchema);
export default Product;