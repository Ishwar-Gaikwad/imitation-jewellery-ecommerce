import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';


export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
            res.status(400);
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
            res.status(400);
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        return {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.discountPrice || product.price,
          quantity: item.quantity,
        };
      })
    );

    const itemsTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingFee = itemsTotal > 2000 ? 0 : 100; 
    const totalAmount = itemsTotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsTotal,
      shippingFee,
      totalAmount,
    });


    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
      )
    );

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true, context: 'query' }
    );

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400);
    }
    next(error);
  }
};