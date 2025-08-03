import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Users, 
  ExternalLink, 
  Trash2, 
  LogOut,
  Heart,
  Calendar,
  MapPin,
  Copy
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const WeddingManager = () => {
  const { logout } = useAuth();
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setCurrentWedding } = useAuth();

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/weddings`);
      setWeddings(response.data.weddings);
    } catch (error) {
      toast.error('Failed to fetch weddings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWeddingClick = async () => {
    try {
      // Create a default wedding with current date + 1 year
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      
      const weddingData = {
        brideName: 'Bride',
        groomName: 'Groom',
        weddingDate: defaultDate.toISOString().split('T')[0],
        ceremonyTime: '18:00',
        venueDetails: '',
        welcomeMessage: 'We are excited to celebrate our special day with you!',
        language: 'en',
        colors: {},
        fonts: {},
        layoutStyle: 'modern',
        countdownStyle: 'digital',
        connectionOptions: [
          'Friend of the Bride',
          'Friend of the Groom',
          'Family of the Bride',
          'Family of the Groom'
        ]
      };

      const response = await axios.post(`${API_URL}/api/weddings`, weddingData);
      const newWedding = response.data.wedding;
      
      // Set as current wedding and navigate to dashboard
      setCurrentWedding(newWedding);
      localStorage.setItem('currentWedding', JSON.stringify(newWedding));
      navigate('/dashboard');
      
      // Wedding created silently
    } catch (error) {
      toast.error('Failed to create wedding');
    }
  };

  const handleDeleteWedding = async (weddingId) => {
    if (!window.confirm('Are you sure you want to delete this wedding? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/weddings/${weddingId}`);
      setWeddings(weddings.filter(w => w.weddingId !== weddingId));
      // Wedding deleted silently
    } catch (error) {
      toast.error('Failed to delete wedding');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
          // Copied silently
  };

  const getLocalIPAddress = () => {
    // This is a simple way to get the local IP, but it might not work in all browsers
    return new Promise((resolve) => {
      const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
      if (!RTCPeerConnection) {
        resolve('localhost');
        return;
      }
      
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        const ip = event.candidate.candidate.split(' ')[4];
        if (ip.indexOf('.') !== -1) {
          resolve(ip);
        }
        pc.close();
      };
      
      setTimeout(() => resolve('localhost'), 1000);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWeddingClick = (wedding) => {
    setCurrentWedding(wedding);
    localStorage.setItem('currentWedding', JSON.stringify(wedding));
    navigate('/dashboard');
  };

      if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 font-medium drop-shadow-lg">Loading your beautiful weddings...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Wedding Manager
            </h1>
            <p className="text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium drop-shadow-lg">
              ✨ Manage all your beautiful weddings and RSVP forms
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleCreateWeddingClick}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Wedding
            </button>
            <button
              onClick={logout}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl border-2 border-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Weddings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weddings.map((wedding, index) => (
            <div
              key={wedding.weddingId}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 cursor-pointer border border-white/20 overflow-hidden group"
              onClick={() => handleWeddingClick(wedding)}
            >
              {/* Gradient Header */}
              <div 
                className={`p-3 text-white ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      {wedding.brideName} & {wedding.groomName}
                    </h3>
                    <div className="flex items-center text-pink-100 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(wedding.weddingDate)}
                    </div>
                    {wedding.venueDetails && (
                      <div className="flex items-center text-pink-100 text-xs mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {wedding.venueDetails}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteWedding(wedding.weddingId); }}
                    className="p-1 text-pink-100 hover:text-red-300 transition-colors rounded hover:bg-white hover:bg-opacity-20"
                    title="Delete Wedding"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 space-y-3">
                {/* Admin Code */}
                <div className={`rounded-lg p-2 border ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' :
                  'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${
                      index % 4 === 0 ? 'text-purple-700' :
                      index % 4 === 1 ? 'text-blue-700' :
                      index % 4 === 2 ? 'text-green-700' :
                      'text-orange-700'
                    }`}>Admin Code:</span>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(wedding.adminCode); }}
                      className={`p-1 rounded transition-colors ${
                        index % 4 === 0 ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                        index % 4 === 1 ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                        index % 4 === 2 ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                        'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <code className={`text-xs bg-white px-2 py-1 rounded border block font-mono ${
                    index % 4 === 0 ? 'border-purple-200 text-purple-800' :
                    index % 4 === 1 ? 'border-blue-200 text-blue-800' :
                    index % 4 === 2 ? 'border-green-200 text-green-800' :
                    'border-orange-200 text-orange-800'
                  }`}>
                    {wedding.adminCode}
                  </code>
                </div>

                {/* RSVP Link */}
                <div className={`rounded-lg p-2 border ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' :
                  'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${
                      index % 4 === 0 ? 'text-purple-700' :
                      index % 4 === 1 ? 'text-blue-700' :
                      index % 4 === 2 ? 'text-green-700' :
                      'text-orange-700'
                    }`}>RSVP Link:</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={e => { e.stopPropagation(); copyToClipboard(`http://localhost:3000/rsvp/${wedding.weddingId}`); }}
                        className={`p-1 rounded transition-colors ${
                          index % 4 === 0 ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          index % 4 === 1 ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          index % 4 === 2 ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                        }`}
                        title="Copy RSVP Link"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <a
                        href={`http://localhost:3000/rsvp/${wedding.weddingId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1 rounded transition-colors ${
                          index % 4 === 0 ? 'text-purple-600 hover:text-purple-800 hover:bg-purple-100' :
                          index % 4 === 1 ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                          index % 4 === 2 ? 'text-green-600 hover:text-green-800 hover:bg-green-100' :
                          'text-orange-600 hover:text-orange-800 hover:bg-orange-100'
                        }`}
                        title="Open RSVP Form"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <code className={`text-xs bg-white px-2 py-1 rounded border block break-all font-mono ${
                    index % 4 === 0 ? 'border-purple-200 text-purple-800' :
                    index % 4 === 1 ? 'border-blue-200 text-blue-800' :
                    index % 4 === 2 ? 'border-green-200 text-green-800' :
                    'border-orange-200 text-orange-800'
                  }`}>
                    http://localhost:3000/rsvp/{wedding.weddingId}
                  </code>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500">
                      💡 Note: This link only works on your computer.
                    </p>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        const ip = await getLocalIPAddress();
                        const networkUrl = `http://${ip}:3000/rsvp/${wedding.weddingId}`;
                        copyToClipboard(networkUrl);
                        // Network link copied silently
                      }}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        index % 4 === 0 ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' :
                        index % 4 === 1 ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' :
                        index % 4 === 2 ? 'bg-green-100 hover:bg-green-200 text-green-700' :
                        'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      }`}
                    >
                      📋 Copy Network Link
                    </button>
                  </div>
                </div>


              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {weddings.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-white/30">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 drop-shadow-lg">
              No weddings yet
            </h3>
            <p className="text-gray-700 mb-8 text-lg drop-shadow-lg">
              Create your first beautiful wedding to get started
            </p>
            <button
              onClick={handleCreateWeddingClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-6 w-6 mr-2 inline" />
              Create Your First Wedding
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingManager; 