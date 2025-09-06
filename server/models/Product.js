const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Clothing', 'Electronics', 'Home & Kitchen', 'Books', 'Toys & Games', 'Furniture', 'Sports', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  imagePlaceholder: {
    type: String,
    default: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Product+Image'
  },
  isSold: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
