const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        populate: {
          path: 'owner',
          select: 'username avatarUrl'
        }
      });
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to cart
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    
    // Check if product exists and is not sold
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.isSold) {
      return res.status(400).json({ message: 'Product is already sold' });
    }
    
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }
    
    // Check if user is not the owner
    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add your own product to cart' });
    }
    
    // Check if product is already in cart
    const user = await User.findById(req.user._id);
    const existingCartItem = user.cart.find(item => item.product.toString() === productId);
    
    if (existingCartItem) {
      // Update quantity if already in cart
      existingCartItem.quantity += parseInt(quantity);
      if (existingCartItem.quantity > product.quantity) {
        return res.status(400).json({ message: 'Not enough quantity available' });
      }
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity)
      });
    }
    
    await user.save();
    
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough quantity available' });
    }
    
    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not in cart' });
    }
    
    cartItem.quantity = parseInt(quantity);
    await user.save();
    
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Checkout (move cart items to purchases and update quantities)
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product');
    
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Check if all items have enough quantity
    for (const cartItem of user.cart) {
      if (cartItem.product.quantity < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Not enough quantity available for ${cartItem.product.title}` 
        });
      }
    }
    
    // Update product quantities and mark as sold if quantity reaches 0
    for (const cartItem of user.cart) {
      const product = cartItem.product;
      product.quantity -= cartItem.quantity;
      
      if (product.quantity === 0) {
        product.isSold = true;
      }
      
      await product.save();
      
      // Add to purchases (one entry per quantity)
      for (let i = 0; i < cartItem.quantity; i++) {
        user.purchases.push(product._id);
      }
    }
    
    // Clear cart
    user.cart = [];
    await user.save();
    
    res.json({ message: 'Checkout successful! Items moved to purchases.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's purchases
router.get('/purchases', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'purchases',
        populate: {
          path: 'owner',
          select: 'username avatarUrl'
        }
      });
    
    res.json(user.purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
