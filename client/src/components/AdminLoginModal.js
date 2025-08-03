import React, { useState } from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLoginModal = ({ weddingId, onClose }) => {
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAsWeddingAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!adminCode.trim()) {
      toast.error('Please enter the admin code');
      return;
    }

    setLoading(true);
    try {
      const success = await loginAsWeddingAdmin(adminCode);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Lock className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Wedding Admin Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">
              Wedding Admin Code
            </label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="form-input"
              placeholder="Enter wedding admin code"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Enter the admin code provided by the wedding organizers to access the wedding dashboard.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !adminCode.trim()}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <ArrowRight className="h-5 w-5 mr-2" />
              )}
              Access Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal; 