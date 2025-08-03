import React, { useState } from 'react';
import { X, Heart, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';

const CreateWeddingModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    ceremonyTime: '',
    venueDetails: '',
    welcomeMessage: '',
    language: 'en',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B'
    },
    fonts: {
      english: 'Inter',
      hebrew: 'Assistant'
    },
    layoutStyle: 'modern',
    connectionOptions: [
      'Friend of the Bride',
      'Friend of the Groom',
      'Family of the Bride',
      'Family of the Groom'
    ]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.brideName || !formData.groomName || !formData.weddingDate || !formData.ceremonyTime) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating wedding:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectionOptions = [
    'Friend of the Bride',
    'Friend of the Groom',
    'Family of the Bride',
    'Family of the Groom',
    'College Friend',
    'Work Colleague',
    'Neighbor',
    'Other'
  ];

  const toggleConnectionOption = (option) => {
    setFormData(prev => ({
      ...prev,
      connectionOptions: prev.connectionOptions.includes(option)
        ? prev.connectionOptions.filter(o => o !== option)
        : [...prev.connectionOptions, option]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Wedding</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Bride's Name *</label>
                <input
                  type="text"
                  value={formData.brideName}
                  onChange={(e) => handleChange('brideName', e.target.value)}
                  className="form-input"
                  placeholder="Enter bride's name"
                  required
                />
              </div>
              <div>
                <label className="form-label">Groom's Name *</label>
                <input
                  type="text"
                  value={formData.groomName}
                  onChange={(e) => handleChange('groomName', e.target.value)}
                  className="form-input"
                  placeholder="Enter groom's name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Wedding Date *</label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleChange('weddingDate', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Ceremony Time *</label>
                <input
                  type="time"
                  value={formData.ceremonyTime}
                  onChange={(e) => handleChange('ceremonyTime', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Venue Details</label>
              <input
                type="text"
                value={formData.venueDetails}
                onChange={(e) => handleChange('venueDetails', e.target.value)}
                className="form-input"
                placeholder="Enter venue details"
              />
            </div>

            <div>
              <label className="form-label">Welcome Message</label>
              <textarea
                value={formData.welcomeMessage}
                onChange={(e) => handleChange('welcomeMessage', e.target.value)}
                className="form-input"
                rows="3"
                placeholder="Enter a custom welcome message for your guests"
              />
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Language Settings</h3>
            
            <div>
              <label className="form-label">Primary Language</label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="form-select"
              >
                <option value="en">English 🇺🇸</option>
                <option value="he">Hebrew 🇮🇱</option>
              </select>
            </div>
          </div>

          {/* Connection Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Connection Options</h3>
            <p className="text-sm text-gray-600 mb-3">
              Select which connection options will appear on the RSVP form:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {connectionOptions.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.connectionOptions.includes(option)}
                    onChange={() => toggleConnectionOption(option)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
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
              disabled={loading || !formData.brideName || !formData.groomName || !formData.weddingDate || !formData.ceremonyTime}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Heart className="h-5 w-5 mr-2" />
              )}
              Create Wedding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWeddingModal; 