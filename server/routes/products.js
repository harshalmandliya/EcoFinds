const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products with search and filter
router.get('/', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 12 } = req.query;
    
    let query = { isSold: false };
    
    // Search by title or description
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('owner', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'username avatarUrl');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, price, quantity, imagePlaceholder } = req.body;
    
    // Validation
    if (!title || !description || !category || !price || !quantity) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const product = new Product({
      owner: req.user._id,
      title,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imagePlaceholder: imagePlaceholder || 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Product+Image'
    });
    
    await product.save();
    await product.populate('owner', 'username avatarUrl');
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    const { title, description, category, price, quantity, imagePlaceholder } = req.body;
    
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price ? parseFloat(price) : product.price;
    product.quantity = quantity ? parseInt(quantity) : product.quantity;
    product.imagePlaceholder = imagePlaceholder || product.imagePlaceholder;
    
    await product.save();
    await product.populate('owner', 'username avatarUrl');
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user owns the product
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's products
router.get('/user/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .populate('owner', 'username avatarUrl')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
