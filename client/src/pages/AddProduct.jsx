import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '1',
    imagePlaceholder: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const categories = ['Clothing', 'Electronics', 'Home & Kitchen', 'Books', 'Toys & Games', 'Furniture', 'Sports', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (parseInt(formData.quantity) < 1) {
      setError('Quantity must be at least 1');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/products', formData);
      navigate('/my-listings');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Add New Product</h1>
        <p className="text-gray-600 mt-2">Share your sustainable items with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="input-field"
                placeholder="Enter product title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="1"
                  className="input-field"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="input-field"
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="imagePlaceholder" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <div className="flex space-x-4">
                <input
                  type="url"
                  id="imagePlaceholder"
                  name="imagePlaceholder"
                  className="input-field flex-1"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imagePlaceholder}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn-secondary flex items-center"
                  onClick={() => {
                    const placeholder = `https://via.placeholder.com/300x200/10B981/FFFFFF?text=${encodeURIComponent(formData.title || 'Product+Image')}`;
                    setFormData({ ...formData, imagePlaceholder: placeholder });
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Generate
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to use a default placeholder image
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
