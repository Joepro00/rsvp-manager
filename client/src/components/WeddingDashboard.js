import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Settings, 
  Download, 
  LogOut,
  BarChart3,
  Edit,
  ExternalLink,
  Copy,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Menu } from '@headlessui/react';
import CustomizeRSVPForm from './CustomizeRSVPForm';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const WeddingDashboard = () => {
  const { currentWedding, logoutFromWedding } = useAuth();
  const [stats, setStats] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentWedding) {
      fetchData();
    }
  }, [currentWedding]);

  const fetchData = async () => {
    try {
      const [statsResponse, responsesResponse] = await Promise.all([
        axios.get(`${API_URL}/api/rsvp/${currentWedding.weddingId}/statistics`),
        axios.get(`${API_URL}/api/rsvp/${currentWedding.weddingId}/responses`)
      ]);
      
      setStats(statsResponse.data.statistics);
      setResponses(responsesResponse.data.responses);
    } catch (error) {
      toast.error('Failed to fetch wedding data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (filterType = 'all') => {
    try {
      const response = await axios.get(`${API_URL}/api/rsvp/${currentWedding.weddingId}/export?filter=${filterType}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `guest-list-${currentWedding.weddingId}-${filterType}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Guest list exported successfully');
    } catch (error) {
      toast.error('Failed to export guest list');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Are you sure you want to delete this RSVP response? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/rsvp/${currentWedding.weddingId}/responses/${responseId}`);
      toast.success('RSVP response deleted successfully');
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      toast.error('Failed to delete RSVP response');
    }
  };

  const handleDeleteAllDuplicates = async () => {
    const duplicateIds = Object.keys(duplicates);
    if (duplicateIds.length === 0) {
      toast.error('No duplicates found to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete all ${duplicateIds.length} duplicate RSVP responses? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete all duplicates
      const deletePromises = duplicateIds.map(id => 
        axios.delete(`${API_URL}/api/rsvp/${currentWedding.weddingId}/responses/${id}`)
      );
      
      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${duplicateIds.length} duplicate responses`);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting duplicates:', error);
      toast.error('Failed to delete some duplicate responses');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const filteredResponses = responses.filter(response => {
    if (filter === 'not-attending') return !response.attending;
    if (!response.attending) return false;
    if (filter === 'all') return response.attending;
    if (filter === 'bride-friend') return response.connectionType === 'Friend of the Bride';
    if (filter === 'groom-friend') return response.connectionType === 'Friend of the Groom';
    if (filter === 'bride-family') return response.connectionType === 'Family of the Bride';
    if (filter === 'groom-family') return response.connectionType === 'Family of the Groom';
    return true;
  });

  // Improved duplicate detection with fuzzy matching
  const findSimilarNames = (responses) => {
    const nameGroups = {};
    const duplicates = {};
    
    responses.forEach(response => {
      const firstName = response.firstName?.trim().toLowerCase() || '';
      const lastName = response.lastName?.trim().toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`;
      
      // Normalize names for better matching
      const normalizedFirstName = firstName.replace(/[^a-z]/g, '');
      const normalizedLastName = lastName.replace(/[^a-z]/g, '');
      const normalizedFullName = `${normalizedFirstName} ${normalizedLastName}`;
      
      // Create variations for fuzzy matching
      const variations = [
        fullName,
        normalizedFullName,
        // Handle common variations
        `${firstName} ${normalizedLastName}`,
        `${normalizedFirstName} ${lastName}`,
        // Handle common misspellings and variations
        fullName.replace(/yossi/g, 'yossi'),
        fullName.replace(/yosi/g, 'yossi'),
        fullName.replace(/yossi/g, 'yosi'),
        fullName.replace(/prober/g, 'prober'),
        fullName.replace(/prober/g, 'prober'),
        // Handle case variations
        fullName.toUpperCase(),
        fullName.toLowerCase(),
        // Handle spacing variations
        fullName.replace(/\s+/g, ' '),
        fullName.replace(/\s+/g, ''),
      ];
      
      let found = false;
      for (const variation of variations) {
        if (nameGroups[variation] && nameGroups[variation].length > 0) {
          // Check if this is actually a duplicate (not the first entry)
          const existingGroup = nameGroups[variation];
          if (existingGroup.length > 0) {
            existingGroup.push(response);
            duplicates[response.id] = true;
            // Also mark the first entry as a duplicate for consistency
            if (existingGroup.length > 1) {
              duplicates[existingGroup[0].id] = true;
            }
          }
          found = true;
          break;
        }
      }
      
      if (!found) {
        nameGroups[fullName] = [response];
      }
    });
    
    return { nameGroups, duplicates };
  };

  const { nameGroups, duplicates } = findSimilarNames(responses);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
              Wedding Dashboard
            </h1>
            <p className="text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-medium drop-shadow-lg">
              {currentWedding.brideName} & {currentWedding.groomName}
            </p>
          </div>
          <div className="relative">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Settings className="h-5 w-5 mr-2" />
                Menu
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white/95 backdrop-blur-sm border border-white/20 divide-y divide-white/10 rounded-xl shadow-lg focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`${active ? 'bg-gradient-to-r from-pink-50 to-purple-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200`}
                      >
                        <BarChart3 className="h-4 w-4 inline mr-2 text-pink-600" /> Overview
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setActiveTab('guest-list')}
                        className={`${active ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200`}
                      >
                        <Users className="h-4 w-4 inline mr-2 text-blue-600" /> Guest List
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/customize')}
                        className={`${active ? 'bg-gradient-to-r from-green-50 to-emerald-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200`}
                      >
                        <Edit className="h-4 w-4 inline mr-2 text-green-600" /> Customize
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowPreviewModal(true)}
                        className={`${active ? 'bg-gradient-to-r from-orange-50 to-red-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200`}
                      >
                        <ExternalLink className="h-4 w-4 inline mr-2 text-orange-600" /> View RSVP
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          const rsvpLink = `${window.location.origin}/rsvp/${currentWedding.weddingId}`;
                          navigator.clipboard.writeText(rsvpLink);
                          // RSVP link copied silently
                        }}
                        className={`${active ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200`}
                      >
                        <Copy className="h-4 w-4 inline mr-2 text-purple-600" /> Share Link
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logoutFromWedding}
                        className={`${active ? 'bg-gradient-to-r from-red-50 to-pink-50' : ''} w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200`}
                      >
                        <LogOut className="h-4 w-4 inline mr-2 text-red-600" /> Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* Wedding Info */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-pink-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800 drop-shadow-sm">Wedding Date</p>
                <p className="text-gray-700 drop-shadow-sm">{formatDate(currentWedding.weddingDate)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800 drop-shadow-sm">Venue</p>
                <p className="text-gray-700 drop-shadow-sm">{currentWedding.venueDetails || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800 drop-shadow-sm">Language</p>
                <p className="text-gray-700 drop-shadow-sm">{currentWedding.language === 'he' ? 'Hebrew' : 'English'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold drop-shadow-lg">{stats?.total || 0}</div>
                <div className="text-pink-100 text-sm font-medium drop-shadow-lg">Total RSVPs</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold drop-shadow-lg">{stats?.attending || 0}</div>
                <div className="text-blue-100 text-sm font-medium drop-shadow-lg">Attending</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold drop-shadow-lg">{stats?.notAttending || 0}</div>
                <div className="text-green-100 text-sm font-medium drop-shadow-lg">Not Attending</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-3xl font-bold drop-shadow-lg">{stats?.guestCount || 0}</div>
                <div className="text-orange-100 text-sm font-medium drop-shadow-lg">Total Guests</div>
              </div>
            </div>

            {/* Connection Breakdown */}
            {stats?.connectionBreakdown && Object.keys(stats.connectionBreakdown).length > 0 && (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">Connection Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.connectionBreakdown).map(([connection, count], index) => (
                    <div key={connection} className={`rounded-lg p-4 border ${
                      index % 4 === 0 ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100' :
                      index % 4 === 1 ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100' :
                      index % 4 === 2 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' :
                      'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-medium drop-shadow-sm ${
                          index % 4 === 0 ? 'text-pink-800' :
                          index % 4 === 1 ? 'text-blue-800' :
                          index % 4 === 2 ? 'text-green-800' :
                          'text-orange-800'
                        }`}>{connection}</span>
                        <span className={`text-2xl font-bold drop-shadow-sm ${
                          index % 4 === 0 ? 'text-pink-600' :
                          index % 4 === 1 ? 'text-blue-600' :
                          index % 4 === 2 ? 'text-green-600' :
                          'text-orange-600'
                        }`}>{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guest List Tab */}
        {activeTab === 'guest-list' && (
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Guest List</h3>
                <div className="flex space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-auto px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-gray-700 font-medium"
                  >
                    <option value="all">All Attending</option>
                    <option value="bride-friend">Friends of the Bride</option>
                    <option value="groom-friend">Friends of the Groom</option>
                    <option value="bride-family">Family of the Bride</option>
                    <option value="groom-family">Family of the Groom</option>
                    <option value="not-attending">Not Attending</option>
                  </select>
                  <button
                    onClick={() => handleExport(filter)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Duplicate Summary */}
              {Object.keys(duplicates).length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        {Object.keys(duplicates).length} potential duplicate(s) detected
                      </span>
                    </div>
                    <button
                      onClick={handleDeleteAllDuplicates}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Duplicates
                    </button>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2">
                    Similar names have been detected. You can delete individual entries using the trash icon, or delete all duplicates at once.
                  </p>
                </div>
              )}
            </div>

            {/* Guest List Table */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Name</th>
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Status</th>
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-green-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">Connection</th>
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Guests</th>
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                        duplicates[response.id] ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                      }`}>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 flex items-center">
                            {response.firstName} {response.lastName}
                            {duplicates[response.id] && (
                              <span title="Possible duplicate - similar name found" className="ml-2 text-yellow-600">
                                <AlertTriangle className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            response.attending
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {response.attending ? 'Attending' : 'Not Attending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {response.connectionType || '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {response.guestCount}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteResponse(response.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Delete this RSVP response"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredResponses.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">No responses found for the selected filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">RSVP Form Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <iframe
                src={`/rsvp/${currentWedding.weddingId}`}
                className="w-full h-[800px] border-0"
                title="RSVP Form Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingDashboard; 