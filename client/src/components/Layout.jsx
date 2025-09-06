import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, User, ShoppingCart, LogOut, Home, Sparkles, Star, Heart, Zap } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EcoFinds</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/my-listings"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/my-listings') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>My Listings</span>
                  </Link>
                  
                  <Link
                    to="/cart"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/cart') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart</span>
                  </Link>
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <Star className="w-3 h-3 text-blue-500" />
                      <Heart className="w-3 h-3 text-red-500" />
                      <Zap className="w-3 h-3 text-purple-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating Add Button */}
      {user && (
        <Link
          to="/add-product"
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-50"
        >
          <Plus className="w-6 h-6" />
        </Link>
      )}
    </div>
  );
};

export default Layout;
