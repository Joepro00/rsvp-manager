import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Lock, Users, ArrowRight } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('master');
  const [masterCode, setMasterCode] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const { loginAsMaster, loginAsWeddingAdmin, loading } = useAuth();

  const handleMasterLogin = async (e) => {
    e.preventDefault();
    if (masterCode.trim()) {
      await loginAsMaster(masterCode);
    }
  };

  const handleWeddingLogin = async (e) => {
    e.preventDefault();
    if (adminCode.trim()) {
      await loginAsWeddingAdmin(adminCode);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            RSVP Manager
          </h2>
          <p className="text-gray-600">
            Complete wedding RSVP management system
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('master')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'master'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Master Admin
            </button>
            <button
              onClick={() => setActiveTab('wedding')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'wedding'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Wedding Admin
            </button>
          </div>

          {/* Master Admin Login */}
          {activeTab === 'master' && (
            <form onSubmit={handleMasterLogin} className="space-y-4">
              <div>
                <label className="form-label">
                  Master Access Code
                </label>
                <input
                  type="password"
                  value={masterCode}
                  onChange={(e) => setMasterCode(e.target.value)}
                  className="form-input"
                  placeholder="Enter master code"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !masterCode.trim()}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Access Manager
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Wedding Admin Login */}
          {activeTab === 'wedding' && (
            <form onSubmit={handleWeddingLogin} className="space-y-4">
              <div>
                <label className="form-label">
                  Wedding Admin Code
                </label>
                <input
                  type="text"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="form-input"
                  placeholder="Enter wedding admin code"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !adminCode.trim()}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Access Wedding
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Section */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>
            <strong>Master Admin:</strong> Create and manage multiple weddings
          </p>
          <p>
            <strong>Wedding Admin:</strong> Manage specific wedding details and RSVPs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 