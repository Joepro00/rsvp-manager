import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Components
import Login from './components/Login';
import WeddingManager from './components/WeddingManager';
import WeddingDashboard from './components/WeddingDashboard';
import RSVPForm from './components/RSVPForm';
import ProtectedRoute from './components/ProtectedRoute';
import CustomizeWeddingPage from './components/CustomizeWeddingPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isMasterAdmin, currentWedding } = useAuth();

  return (
    <ErrorBoundary>
      <div className="min-h-screen gradient-bg">
        <Routes>
          {/* Public RSVP Form */}
          <Route path="/rsvp/:weddingId" element={<RSVPForm />} />
          
          {/* Login Page */}
          <Route 
            path="/login" 
            element={
              !isMasterAdmin && !currentWedding ? (
                <Login />
              ) : (
                <Navigate to={isMasterAdmin ? "/manager" : "/dashboard"} replace />
              )
            } 
          />
          
          {/* Master Admin Routes */}
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute requireMaster>
                <WeddingManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Wedding Admin Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireWedding>
                <WeddingDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Customize Wedding Page */}
          <Route path="/customize" element={<CustomizeWeddingPage />} />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              isMasterAdmin ? (
                <Navigate to="/manager" replace />
              ) : currentWedding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App; 