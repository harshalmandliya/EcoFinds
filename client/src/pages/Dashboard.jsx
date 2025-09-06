import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Package, Edit, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [purchasesResponse, productsResponse] = await Promise.all([
        axios.get('/api/cart/purchases'),
        axios.get('/api/products/user/my-products')
      ]);
      setPurchases(purchasesResponse.data);
      setMyProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Purchases',
      value: purchases.length,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'My Products',
      value: myProducts.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Sold Items',
      value: myProducts.filter(p => p.isSold).length,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        <Link
          to="/add-product"
          className="btn-primary flex items-center"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Purchases</h2>
            <Link
              to="/purchases"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-500 mb-4">Start shopping to see your purchases here</p>
              <Link
                to="/"
                className="btn-primary"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.slice(0, 3).map((purchase) => (
                <div key={purchase._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={purchase.imagePlaceholder}
                    alt={purchase.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{purchase.title}</h3>
                    <p className="text-sm text-gray-500">Purchased from {purchase.owner.username}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">${purchase.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Products */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
            <Link
              to="/my-listings"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {myProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
              <Link
                to="/add-product"
                className="btn-primary"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myProducts.slice(0, 3).map((product) => (
                <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={product.imagePlaceholder}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isSold 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.isSold ? 'Sold' : 'Available'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">${product.price}</p>
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="text-sm text-gray-500 hover:text-primary-600 flex items-center"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
