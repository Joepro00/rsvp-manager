import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CountdownTimer from './CountdownTimer';
import { API_URL } from '../config';

const CustomizeWeddingPage = () => {
  const { currentWedding, setCurrentWedding } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brideName: currentWedding?.brideName || '',
    groomName: currentWedding?.groomName || '',
    welcomeMessage: currentWedding?.welcomeMessage || '',
    weddingDate: currentWedding?.weddingDate || '',
    ceremonyTime: currentWedding?.ceremonyTime || '',
    venue: currentWedding?.venue || '',
    venueAddress: currentWedding?.venueAddress || '',
    language: currentWedding?.language || 'en',
    connectionOptions: currentWedding?.connectionOptions?.length > 0 ? currentWedding.connectionOptions : [
      'Friend of the Bride',
      'Friend of the Groom',
      'Family of the Bride',
      'Family of the Groom'
    ],
  });
  const [activeTab, setActiveTab] = useState('form');
  const [newConnection, setNewConnection] = useState('');

  const [visualStyle, setVisualStyle] = useState({
    colors: {
      primary: currentWedding?.colors?.primary || '#8B5CF6',
      background: currentWedding?.colors?.background || '#FFFFFF',
      text: currentWedding?.colors?.text || '#1F2937'
    },
    font: currentWedding?.fonts?.main || 'Inter',
    countdownStyle: currentWedding?.countdownStyle || 'digital'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveConnection = (option) => {
    setForm(prev => ({
      ...prev,
      connectionOptions: prev.connectionOptions.filter(o => o !== option)
    }));
  };

  const handleAddConnection = () => {
    if (newConnection.trim() && !form.connectionOptions.includes(newConnection.trim())) {
      setForm(prev => ({
        ...prev,
        connectionOptions: [...prev.connectionOptions, newConnection.trim()]
      }));
      setNewConnection('');
    }
  };

  const handleVisualChange = (field, value) => {
    setVisualStyle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (colorType, value) => {
    setVisualStyle(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentWedding) {
        console.error('No current wedding found');
        toast.error('No wedding selected');
        return;
      }
      
      if (!currentWedding.weddingId) {
        console.error('No wedding ID found:', currentWedding);
        toast.error('Invalid wedding data');
        return;
      }
      
      const updatedData = {
        brideName: form.brideName,
        groomName: form.groomName,
        weddingDate: form.weddingDate,
        ceremonyTime: form.ceremonyTime,
        venueDetails: form.venueDetails || '',
        venue: form.venue || '',
        venueAddress: form.venueAddress || '',
        welcomeMessage: form.welcomeMessage || '',
        language: form.language || 'en',
        colors: visualStyle.colors,
        fonts: { main: visualStyle.font },
        layoutStyle: form.layoutStyle || 'modern',
        countdownStyle: visualStyle.countdownStyle,
        connectionOptions: form.connectionOptions || []
      };
      
      console.log('=== CUSTOMIZE PAGE DEBUG ===');
      console.log('Saving data:', updatedData);
      console.log('Wedding ID:', currentWedding.weddingId);
      console.log('Current wedding object:', currentWedding);
      console.log('Current wedding colors:', currentWedding.colors);
      
      const response = await axios.put(`${API_URL}/api/weddings/${currentWedding.weddingId}`, updatedData);
      console.log('Save response:', response.data);
      
      const updatedWedding = {
        ...currentWedding,
        ...updatedData
      };
      setCurrentWedding(updatedWedding);
      localStorage.setItem('currentWedding', JSON.stringify(updatedWedding));
      
      // Changes saved silently
      
      return true;
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(`Failed to save changes: ${error.response?.data?.error || error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

      return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Customize Your RSVP Form
              </h1>
              <p className="text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">✨ Make your wedding form beautiful and unique</p>
            </div>
                      <button 
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </button>
        </div>

        <div className="mb-8">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <button 
              className="w-full text-left py-4 px-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 font-semibold text-lg transition-all duration-200" 
              onClick={() => setActiveTab(activeTab ? '' : 'form')}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">🎨 RSVP Customization</span>
                <span className="text-purple-600 font-bold text-xl">{activeTab ? '−' : '+'}</span>
              </div>
            </button>
            {activeTab && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="flex space-x-4 mb-6">
                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === 'form' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                    onClick={() => setActiveTab('form')}
                  >
                    📝 Form Settings
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === 'connections' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                    onClick={() => setActiveTab('connections')}
                  >
                    👥 Connection Options
                  </button>
                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === 'style' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                    onClick={() => setActiveTab('style')}
                  >
                    🎨 Visual Style
                  </button>
                </div>

                {activeTab === 'form' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">👰 Bride's Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={form.brideName}
                        onChange={e => handleChange('brideName', e.target.value)}
                        placeholder="Enter bride's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🤵 Groom's Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={form.groomName}
                        onChange={e => handleChange('groomName', e.target.value)}
                        placeholder="Enter groom's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">💝 Welcome Message</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        value={form.welcomeMessage}
                        onChange={e => handleChange('welcomeMessage', e.target.value)}
                        placeholder="Enter a beautiful welcome message for your guests..."
                        rows="3"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Wedding Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          value={form.weddingDate}
                          onChange={e => handleChange('weddingDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">⏰ Ceremony Time</label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          value={form.ceremonyTime}
                          onChange={e => handleChange('ceremonyTime', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🏛️ Venue Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={form.venue}
                        onChange={e => handleChange('venue', e.target.value)}
                        placeholder="Enter venue name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Venue Address</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        value={form.venueAddress}
                        onChange={e => handleChange('venueAddress', e.target.value)}
                        placeholder="Enter venue address"
                        rows="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🌍 Primary Language</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={form.language}
                        onChange={e => handleChange('language', e.target.value)}
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="he">🇮🇱 Hebrew</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'connections' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Connection Options</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {form.connectionOptions.map(option => (
                          <div key={option} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{option}</span>
                            <button type="button" className="text-red-500 ml-2" onClick={() => handleRemoveConnection(option)}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={newConnection}
                        onChange={e => setNewConnection(e.target.value)}
                        placeholder="Add new connection option"
                      />
                      <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200" onClick={handleAddConnection}>Add</button>
                    </div>
                  </div>
                )}

                {activeTab === 'style' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Theme Colors</h3>
                        <button 
                          className="text-sm text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setVisualStyle(prev => ({
                              ...prev,
                              colors: {
                                primary: '#8B5CF6',
                                background: '#FFFFFF',
                                text: '#1F2937'
                              }
                            }));
                          }}
                        >
                          Reset to Default
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              className="w-12 h-10 rounded border"
                              value={visualStyle.colors.primary}
                              onChange={e => handleColorChange('primary', e.target.value)}
                            />
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border rounded-md text-sm"
                              value={visualStyle.colors.primary}
                              onChange={e => handleColorChange('primary', e.target.value)}
                              placeholder="#8B5CF6"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Used for buttons, accents, and highlights</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Background Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              className="w-12 h-10 rounded border"
                              value={visualStyle.colors.background}
                              onChange={e => handleColorChange('background', e.target.value)}
                            />
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border rounded-md text-sm"
                              value={visualStyle.colors.background}
                              onChange={e => handleColorChange('background', e.target.value)}
                              placeholder="#FFFFFF"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Main background color of the form</p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              className="w-12 h-10 rounded border"
                              value={visualStyle.colors.text}
                              onChange={e => handleColorChange('text', e.target.value)}
                            />
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 border rounded-md text-sm"
                              value={visualStyle.colors.text}
                              onChange={e => handleColorChange('text', e.target.value)}
                              placeholder="#1F2937"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Color for all text content</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Font Options</h3>
                        <button 
                          className="text-sm text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setVisualStyle(prev => ({
                              ...prev,
                              font: 'Inter'
                            }));
                          }}
                        >
                          Reset to Default
                        </button>
                      </div>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        value={visualStyle.font}
                        onChange={e => handleVisualChange('font', e.target.value)}
                      >
                        <option value="Inter">Inter - Modern & Clean</option>
                        <option value="Playfair Display">Playfair Display - Elegant Serif</option>
                        <option value="Roboto">Roboto - Professional</option>
                        <option value="Dancing Script">Dancing Script - Handwritten</option>
                        <option value="Montserrat">Montserrat - Contemporary</option>
                      </select>
                      <div className="mt-2 p-3 bg-gray-50 rounded" style={{ fontFamily: visualStyle.font }}>
                        <p className="text-sm">Preview: This is how your text will look with {visualStyle.font}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Countdown Clock Style</h3>
                        <button 
                          className="text-sm text-purple-600 hover:text-purple-800"
                          onClick={() => {
                            setVisualStyle(prev => ({
                              ...prev,
                              countdownStyle: 'digital'
                            }));
                          }}
                        >
                          Reset to Default
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center p-3 border rounded cursor-pointer">
                          <input
                            type="radio"
                            name="countdownStyle"
                            value="digital"
                            checked={visualStyle.countdownStyle === 'digital'}
                            onChange={e => handleVisualChange('countdownStyle', e.target.value)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-semibold">Digital</div>
                            <div className="text-xs text-gray-500">Modern digital display</div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border rounded cursor-pointer">
                          <input
                            type="radio"
                            name="countdownStyle"
                            value="circles"
                            checked={visualStyle.countdownStyle === 'circles'}
                            onChange={e => handleVisualChange('countdownStyle', e.target.value)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-semibold">Circles</div>
                            <div className="text-xs text-gray-500">Elegant circular design</div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border rounded cursor-pointer">
                          <input
                            type="radio"
                            name="countdownStyle"
                            value="elegant"
                            checked={visualStyle.countdownStyle === 'elegant'}
                            onChange={e => handleVisualChange('countdownStyle', e.target.value)}
                            className="mr-2"
                          />
                          <div>
                            <div className="font-semibold">Elegant Lines</div>
                            <div className="text-xs text-gray-500">Sophisticated line design</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Preview Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                👁️ Live Preview
              </h3>
              <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <h1 
                    className="text-3xl font-bold mb-2"
                    style={{ 
                      color: visualStyle.colors?.primary || '#8b5cf6',
                      fontFamily: visualStyle.font || 'Inter'
                    }}
                  >
                    RSVP Form
                  </h1>
                  <p 
                    className="text-lg mb-4"
                    style={{ 
                      color: visualStyle.colors?.text || '#1f2937',
                      fontFamily: visualStyle.font || 'Inter'
                    }}
                  >
                    {form.brideName || 'Bride'} & {form.groomName || 'Groom'}
                  </p>
                  {form.welcomeMessage && (
                    <p 
                      className="text-base mb-4"
                      style={{ 
                        color: visualStyle.colors?.text || '#1f2937',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    >
                      {form.welcomeMessage}
                    </p>
                  )}
                </div>

                {/* Countdown Preview */}
                <div className="mb-6">
                  <h3 
                    className="text-lg font-semibold mb-3"
                    style={{ 
                      color: visualStyle.colors?.text || '#1f2937',
                      fontFamily: visualStyle.font || 'Inter'
                    }}
                  >
                    Countdown to Our Wedding
                  </h3>
                  <CountdownTimer 
                    weddingDate={form.weddingDate || new Date().toISOString()} 
                    style={visualStyle.countdownStyle || 'digital'}
                    colors={visualStyle.colors || {}}
                  />
                </div>

                {/* Form Preview */}
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: visualStyle.colors?.text || '#1f2937',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    >
                      Will you attend? *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input type="radio" name="preview-attending" className="mr-2" />
                        <span style={{ fontFamily: visualStyle.font || 'Inter' }}>Yes, I'll be there!</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="preview-attending" className="mr-2" />
                        <span style={{ fontFamily: visualStyle.font || 'Inter' }}>Sorry, I can't make it</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: visualStyle.colors?.text || '#1f2937',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    >
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      style={{ 
                        borderColor: visualStyle.colors?.primary || '#8b5cf6',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    />
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ 
                        color: visualStyle.colors?.text || '#1f2937',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    >
                      Connection to the couple *
                    </label>
                    <select 
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      style={{ 
                        borderColor: visualStyle.colors?.primary || '#8b5cf6',
                        fontFamily: visualStyle.font || 'Inter'
                      }}
                    >
                      <option>Select your connection</option>
                      {form.connectionOptions?.map((option, index) => (
                        <option key={index}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <div className="flex space-x-4">
                        <button
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={async () => {
                const previewData = {
                  ...currentWedding,
                  brideName: form.brideName,
                  groomName: form.groomName,
                  welcomeMessage: form.welcomeMessage,
                  weddingDate: form.weddingDate,
                  ceremonyTime: form.ceremonyTime,
                  venue: form.venue,
                  venueAddress: form.venueAddress,
                  language: form.language,
                  colors: visualStyle.colors,
                  fonts: { main: visualStyle.font },
                  countdownStyle: visualStyle.countdownStyle,
                  connectionOptions: form.connectionOptions
                };
                
                localStorage.setItem('previewWedding', JSON.stringify(previewData));
                
                const previewUrl = `http://localhost:3000/rsvp/${currentWedding.weddingId}?preview=true&t=${Date.now()}`;
                console.log('Opening preview URL:', previewUrl);
                console.log('Preview data:', previewData);
                
                window.open(previewUrl, '_blank');
                
                // Opening RSVP form silently
              }}
              disabled={!currentWedding?.weddingId || saving}
            >
              👁️ Preview RSVP Form
            </button>
          </div>
                      <button
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeWeddingPage;