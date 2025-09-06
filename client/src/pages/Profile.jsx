import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    avatarUrl: '',
    avatarFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        avatarUrl: user.avatarUrl || '',
        avatarFile: null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          avatarFile: event.target.result,
          avatarUrl: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/api/auth/profile', formData);
      
      // Update the user context with new data
      const updatedUser = {
        ...user,
        username: response.data.user.username,
        avatarUrl: response.data.user.avatarUrl
      };
      
      // Update localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Simple way to update the context
      
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomAvatar = () => {
    const colors = ['4F46E5', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '06B6D4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';
    const avatarUrl = `https://via.placeholder.com/150/${randomColor}/FFFFFF?text=${initials}`;
    
    setFormData({
      ...formData,
      avatarUrl: avatarUrl
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your profile information and avatar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <div className="space-y-6">
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Photo
              </label>
              
              <div className="flex items-center space-x-6">
                {/* Current Avatar */}
                <div className="relative">
                  <img
                    src={formData.avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-1">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>

                {/* Upload Options */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Or use URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/photo.jpg"
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={generateRandomAvatar}
                        className="btn-secondary flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Random
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="input-field"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
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
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
