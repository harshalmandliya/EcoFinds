import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import axios from 'axios';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products/user/my-products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch your products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      setError('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">Manage your products and track their performance</p>
        </div>
        <Link
          to="/add-product"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Start selling by adding your first product</p>
          <Link
            to="/add-product"
            className="btn-primary"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card group">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={product.imagePlaceholder}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {product.isSold ? (
                    <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Sold
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Available
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {!product.isSold && (
                      <Link
                        to={`/edit-product/${product._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                    
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
