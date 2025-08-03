import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [currentWedding, setCurrentWedding] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const masterCode = localStorage.getItem('masterCode');
    const weddingData = localStorage.getItem('currentWedding');
    
    if (masterCode === 'tamar123') {
      setIsMasterAdmin(true);
    }
    
    if (weddingData) {
      try {
        setCurrentWedding(JSON.parse(weddingData));
      } catch (error) {
        localStorage.removeItem('currentWedding');
      }
    }
  }, []);

  const loginAsMaster = async (code) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/master-login', { code });
      
      if (response.data.success) {
        setIsMasterAdmin(true);
        localStorage.setItem('masterCode', code);
        toast.success('Master admin access granted');
        return true;
      }
    } catch (error) {
      console.error('Master login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginAsWeddingAdmin = async (adminCode) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/wedding-login', { adminCode });
      
      if (response.data.success) {
        setCurrentWedding(response.data.wedding);
        localStorage.setItem('currentWedding', JSON.stringify(response.data.wedding));
        toast.success('Wedding admin access granted');
        return true;
      }
    } catch (error) {
      console.error('Wedding admin login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsMasterAdmin(false);
    setCurrentWedding(null);
    localStorage.removeItem('masterCode');
    localStorage.removeItem('currentWedding');
    // Logged out silently
  };

  const logoutFromWedding = () => {
    setCurrentWedding(null);
    localStorage.removeItem('currentWedding');
    // Logged out from wedding admin silently
  };

  const value = {
    isMasterAdmin,
    currentWedding,
    setCurrentWedding, // <-- Expose setter
    loading,
    loginAsMaster,
    loginAsWeddingAdmin,
    logout,
    logoutFromWedding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 