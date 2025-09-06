import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Heart, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCart, setAddingToCart] = useState({});

  const { user } = useAuth();
  const categories = ['All', 'Clothing', 'Electronics', 'Home & Kitchen', 'Books', 'Toys & Games', 'Furniture', 'Sports', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });
      
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId, quantity = 1, e) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();

    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      await axios.post(`/api/cart/add/${productId}`, { quantity });
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Discover Sustainable Treasures
          </h1>
          <p className="text-xl text-primary-100 mb-6">
            Find amazing second-hand items while helping the planet. Every purchase gives items a second life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/add-product"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Selling
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Browse Items
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Categories:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Latest Items'}
          </h2>
          <span className="text-sm text-gray-500">
            {products.length} items found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card hover:shadow-lg transition-shadow duration-200 group">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="aspect-w-16 aspect-h-12 relative">
                    <img
                      src={product.imagePlaceholder}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    {product.isSold && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Sold
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/product/${product._id}`} className="block hover:text-primary-600">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.quantity} available)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{product.owner.username}</span>
                    </div>
                    
                    {/* Add to Cart Section */}
                    {user && user.id !== product.owner._id && !product.isSold && product.quantity > 0 ? (
                      <div className="flex items-center space-x-2">
                        <select
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          onChange={(e) => {
                            const qty = parseInt(e.target.value);
                            if (qty > 0) {
                              handleAddToCart(product._id, qty, e);
                            }
                          }}
                          disabled={addingToCart[product._id]}
                        >
                          <option value="0">Qty</option>
                          {[...Array(Math.min(product.quantity, 10))].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => handleAddToCart(product._id, 1, e)}
                          disabled={addingToCart[product._id]}
                          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Add 1 to Cart"
                        >
                          {addingToCart[product._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ) : !user ? (
                      <button
                        onClick={() => alert('Please log in to add items to cart')}
                        className="bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200"
                        title="Log in to add to cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : product.isSold || product.quantity === 0 ? (
                      <span className="text-xs text-red-500 font-medium">Sold Out</span>
                    ) : (
                      <span className="text-xs text-gray-500">Your item</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
