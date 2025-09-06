import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, CreditCard, ArrowLeft, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`);
      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await axios.put(`/api/cart/update/${productId}`, { quantity: newQuantity });
      setCartItems(cartItems.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleCheckout = async () => {
    if (!window.confirm('Are you sure you want to proceed with checkout? This will purchase all items in your cart.')) {
      return;
    }

    try {
      setCheckingOut(true);
      await axios.post('/api/cart/checkout');
      setCartItems([]);
      alert('Checkout successful! Your items have been moved to purchases.');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        <div className="flex items-center text-gray-500">
          <ShoppingCart className="w-5 h-5 mr-2" />
          <span>{cartItems.length} items</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some sustainable items to get started</p>
          <Link
            to="/"
            className="btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex space-x-4">
                  <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={item.product.imagePlaceholder}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="block hover:text-primary-600 transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 truncate">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.product.category}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            title="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            title="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-primary-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
              <span className="text-sm text-gray-500">{cartItems.length} items</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full mt-6 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <CreditCard className="w-5 h-5 mr-2" />
              )}
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to purchase all items in your cart. 
              Items will be marked as sold and moved to your purchases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
