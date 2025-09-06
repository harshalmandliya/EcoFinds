import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
        </div>
        <div className="flex items-center text-gray-500">
          <ShoppingBag className="w-5 h-5 mr-2" />
          <span>{purchases.length} items</span>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your purchases here</p>
          <Link
            to="/"
            className="btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex space-x-4">
                <Link to={`/product/${purchase._id}`} className="flex-shrink-0">
                  <img
                    src={purchase.imagePlaceholder}
                    alt={purchase.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${purchase._id}`}
                    className="block hover:text-primary-600 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {purchase.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {purchase.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>From {purchase.owner.username}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Purchased {new Date(purchase.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ${purchase.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {purchase.category}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;
