import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, User, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await axios.post(`/api/cart/add/${id}`);
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isOwner = user && user.id === product.owner._id;
  const canAddToCart = user && !isOwner && !product.isSold;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-12">
            <img
              src={product.imagePlaceholder}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.isSold && (
                <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Sold
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            <div className="text-4xl font-bold text-primary-600 mb-6">
              ${product.price}
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center space-x-4">
              <img
                src={product.owner.avatarUrl}
                alt={product.owner.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{product.owner.username}</p>
                <p className="text-sm text-gray-500">Member since {new Date(product.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isOwner ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  This is your product. You can edit or delete it from your listings page.
                </p>
                <button
                  onClick={() => navigate('/my-listings')}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Go to My Listings →
                </button>
              </div>
            ) : canAddToCart ? (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <ShoppingCart className="w-5 h-5 mr-2" />
                )}
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            ) : product.isSold ? (
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">This item has been sold</p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800">Please log in to add items to your cart</p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium"
                >
                  Log In →
                </button>
              </div>
            )}
          </div>

          {/* Product Meta */}
          <div className="border-t pt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Listed {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
