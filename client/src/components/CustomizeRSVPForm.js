import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';

const defaultConnectionOptions = [
  'Friend of the Bride',
  'Friend of the Groom',
  'Family of the Bride',
  'Family of the Groom',
  'College Friend',
  'Work Colleague',
  'Neighbor',
  'Other'
];

const CustomizeRSVPForm = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...initialData,
    connectionOptions: initialData.connectionOptions || [
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

  const toggleConnectionOption = (option) => {
    setFormData(prev => ({
      ...prev,
      connectionOptions: prev.connectionOptions.includes(option)
        ? prev.connectionOptions.filter(o => o !== option)
        : [...prev.connectionOptions, option]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Optionally show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Customize RSVP Form</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Welcome Message */}
        <div>
          <label className="form-label">Welcome Message</label>
          <textarea
            value={formData.welcomeMessage || ''}
            onChange={(e) => handleChange('welcomeMessage', e.target.value)}
            className="form-input"
            rows="3"
            placeholder="Enter a custom welcome message for your guests"
          />
        </div>
        {/* Language Settings */}
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
        {/* Connection Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Connection Options</h3>
          <p className="text-sm text-gray-600 mb-3">
            Select which connection options will appear on the RSVP form:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {defaultConnectionOptions.map((option) => (
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
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Heart className="h-5 w-5 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizeRSVPForm;