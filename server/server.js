const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecofinds';
console.log('Attempting to connect to MongoDB:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Please make sure MongoDB is running on your system');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'EcoFinds API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
