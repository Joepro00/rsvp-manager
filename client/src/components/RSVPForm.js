import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, Settings, Globe } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CountdownTimer from './CountdownTimer';
import AdminLoginModal from './AdminLoginModal';
import { API_URL } from '../config';

const RSVPForm = () => {
  const { weddingId: urlWeddingId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const queryWeddingId = urlParams.get('weddingId');
  const weddingId = queryWeddingId || urlWeddingId;
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    attending: null,
    connectionType: '',
    guestCount: 1
  });

  useEffect(() => {
    fetchWeddingDetails();
    
    // Cleanup function to remove preview data when component unmounts
    return () => {
      const isPreview = urlParams.get('preview') === 'true';
      if (isPreview) {
        localStorage.removeItem('previewWedding');
      }
    };
  }, [weddingId]);

  // Force refresh when URL has refresh parameter
  useEffect(() => {
    const shouldRefresh = urlParams.get('refresh');
    
    if (shouldRefresh) {
      console.log('Force refreshing RSVP form data...');
      // Clear any cached data and force fresh fetch
      localStorage.removeItem('previewWedding');
      fetchWeddingDetails();
    }
  }, []);

  const fetchWeddingDetails = async () => {
    try {
      console.log('=== RSVP FORM DEBUG ===');
      console.log('Fetching wedding details for ID:', weddingId);
      console.log('Current URL:', window.location.href);
      console.log('URL params:', new URLSearchParams(window.location.search).toString());
      
      // Check if this is a preview mode
      const isPreview = urlParams.get('preview') === 'true';
      
      if (isPreview) {
        console.log('Loading preview data from localStorage');
        // Use preview data from localStorage
        const previewData = localStorage.getItem('previewWedding');
        if (previewData) {
          try {
            const previewWedding = JSON.parse(previewData);
            console.log('Preview wedding data:', previewWedding);
            console.log('Preview colors:', previewWedding.colors);
            console.log('Preview fonts:', previewWedding.fonts);
            setWedding(previewWedding);
            setLanguage(previewWedding.language);
            setLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing preview data:', parseError);
            localStorage.removeItem('previewWedding');
          }
        }
      }
      
      console.log('Fetching from API...');
      // Normal flow - fetch from API with aggressive cache busting
      const response = await axios.get(`${API_URL}/api/rsvp/${weddingId}/details?t=${Date.now()}&refresh=${Date.now()}&force=true&nocache=${Date.now()}&v=${Date.now()}`);
      console.log('RSVP Form received wedding data:', response.data.wedding);
      console.log('Colors:', response.data.wedding.colors);
      console.log('Primary color:', response.data.wedding.colors?.primary);
      setWedding(response.data.wedding);
      setLanguage(response.data.wedding.language);
    } catch (error) {
      console.error('Error fetching wedding details:', error);
      if (error.response?.status === 404) {
        toast.error('Wedding not found');
      } else {
        toast.error('Failed to load wedding details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || formData.attending === null) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.attending && !formData.connectionType) {
      toast.error('Please select your connection to the couple');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/rsvp/${weddingId}/submit`, formData);
      setSubmitted(true);
      toast.success('Thank you for RSVPing!');
    } catch (error) {
      toast.error('Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  const translations = {
    en: {
      title: 'RSVP Form',
      subtitle: 'Please respond by',
      countdownTitle: 'Countdown to Our Wedding!',
      welcomeMessage: wedding?.welcomeMessage || 'We are excited to celebrate our special day with you!',
      formTitle: 'RSVP Form',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      attending: 'Will you attend? *',
      yes: 'Yes, I\'ll be there!',
      no: 'Sorry, I can\'t make it',
      connectionType: 'Connection to the couple *',
      guestCount: 'Number of guests',
      submit: 'Send RSVP',
      thankYou: 'Thank you for RSVPing!',
      thankYouMessage: 'We have received your RSVP and look forward to celebrating with you!',
      admin: 'Admin',
      weddingDetails: 'Wedding Details',
      date: 'Date',
      time: 'Time',
      venue: 'Venue'
    },
    he: {
      title: 'אישור השתתפות בחתונה',
      subtitle: 'אנא השיבו עד',
      countdownTitle: 'ספירה לאחור ליום הגדול שלנו!',
      welcomeMessage: wedding?.welcomeMessage || 'אנחנו נרגשים לחגוג איתכם את היום המיוחד שלנו!',
      formTitle: 'טופס אישור השתתפות',
      firstName: 'שם פרטי *',
      lastName: 'שם משפחה *',
      attending: 'האם תשתתפו? *',
      yes: 'כן, אני אהיה שם',
      no: 'מצטער, אני לא אוכל להשתתף',
      connectionType: 'קשר לזוג *',
      guestCount: 'מספר אורחים',
      submit: 'שלח אישור השתתפות',
      thankYou: 'תודה על אישור ההשתתפות!',
      thankYouMessage: 'קיבלנו את אישור ההשתתפות שלכם ואנחנו מצפים לחגוג איתכם!',
      admin: 'מנהל',
      weddingDetails: 'פרטי החתונה',
      date: 'תאריך',
      time: 'שעה',
      venue: 'מיקום'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium drop-shadow-lg">Loading your beautiful RSVP form...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-white/60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-lg">Wedding Not Found</h2>
          <p className="text-gray-700 drop-shadow-lg">The wedding you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <Heart className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t.thankYou}
            </h2>
            <p className="text-gray-600 mb-6">
              {t.thankYouMessage}
            </p>
            <div className="text-sm text-gray-500">
              <p>{wedding.brideName} & {wedding.groomName}</p>
              <p>{new Date(wedding.weddingDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is preview mode
  const isPreview = urlParams.get('preview') === 'true';

  return (
    <div 
      className={`min-h-screen ${language === 'he' ? 'hebrew-font' : ''}`}
      style={{
        fontFamily: wedding.fonts?.main || 'Inter',
        color: wedding.colors?.text || '#ffffff'
      }}
    >
      {/* Preview Mode Indicator */}
      {isPreview && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-yellow-400/30">
          <span className="text-sm font-medium">👁️ Preview Mode - Your current changes</span>
        </div>
      )}

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="lang-toggle"
        style={{ color: wedding.colors?.primary || '#8b5cf6' }}
        title={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
      >
        <Globe className="h-5 w-5" />
      </button>

      {/* Admin Button */}
      <button
        onClick={() => setShowAdminModal(true)}
        className="admin-btn"
        style={{ color: wedding.colors?.primary || '#8b5cf6' }}
        title="Admin Access"
      >
        <Settings className="h-5 w-5" />
      </button>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stunning Header with Floating Elements */}
          <div className="relative text-center mb-12">
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 animate-bounce" style={{ animationDelay: '0s' }}>
                <Heart className="h-8 w-8 text-pink-300/30" />
              </div>
              <div className="absolute top-20 right-20 animate-bounce" style={{ animationDelay: '1s' }}>
                <Heart className="h-6 w-6 text-purple-300/30" />
              </div>
              <div className="absolute bottom-10 left-1/4 animate-bounce" style={{ animationDelay: '2s' }}>
                <Heart className="h-10 w-10 text-blue-300/30" />
              </div>
            </div>

            {/* Main Title with 3D Effect */}
            <div className="relative z-10">
                          <h1 
              className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${wedding.colors?.primary || '#ff90f0'} 0%, ${wedding.colors?.secondary || '#e826a1'} 50%, ${wedding.colors?.accent || '#ff90f0'} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {t.title}
            </h1>
              
              {/* Couple Names with Elegant Typography */}
              <div className="mb-8">
                <p 
                  className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl"
                  style={{ 
                    color: wedding.colors?.text || '#ffffff',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {wedding.brideName} & {wedding.groomName}
                </p>
                <div 
                  className="w-32 h-2 mx-auto rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${wedding.colors?.primary || '#ff90f0'} 0%, ${wedding.colors?.secondary || '#e826a1'} 100%)`
                  }}
                ></div>
              </div>

              {/* Welcome Message with Beautiful Styling */}
              {wedding.welcomeMessage && (
                <div className="max-w-2xl mx-auto mb-8">
                  <p 
                    className="text-lg md:text-xl leading-relaxed italic drop-shadow-lg"
                    style={{ 
                      color: wedding.colors?.text || '#ffffff',
                      opacity: 0.9
                    }}
                  >
                    "{wedding.welcomeMessage}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Section with Glass Morphism */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 
                className="text-2xl font-semibold mb-6 drop-shadow-lg text-center"
                style={{ 
                  color: wedding.colors?.text || '#ffffff',
                  opacity: 0.95
                }}
              >
                {t.countdownTitle}
              </h3>
              <div className="flex justify-center">
                <CountdownTimer 
                  weddingDate={wedding.weddingDate} 
                  style={wedding.countdownStyle || 'digital'}
                  colors={wedding.colors}
                />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Wedding Details Card */}
            <div className="xl:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
                <h3 
                  className="text-2xl font-bold mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${wedding.colors?.primary || '#ff90f0'} 0%, ${wedding.colors?.secondary || '#e826a1'} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {t.weddingDetails}
                </h3>
                
                <div className="space-y-6">
                  {/* Date */}
                  <div className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
                    <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mr-4">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.date}</p>
                      <p className="text-gray-600 font-medium">
                        {new Date(wedding.weddingDate).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.time}</p>
                      <p className="text-gray-600 font-medium">{wedding.ceremonyTime}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  {wedding.venue && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{t.venue}</p>
                        <p className="text-gray-600 font-medium">{wedding.venue}</p>
                        {wedding.venueAddress && (
                          <p className="text-sm text-gray-500 mt-1">{wedding.venueAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RSVP Form - Spans 2 columns */}
            <div className="xl:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
                <h3 
                  className="text-3xl font-bold mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${wedding.colors?.primary || '#ff90f0'} 0%, ${wedding.colors?.secondary || '#e826a1'} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {t.formTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Fields with Beautiful Styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                        {t.firstName}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium placeholder-gray-400"
                          style={{
                            borderColor: wedding.colors?.primary || '#ff90f0',
                            color: wedding.colors?.text || '#1f2937',
                            '--tw-ring-color': wedding.colors?.primary || '#ff90f0'
                          }}
                          placeholder="Enter your first name"
                          required
                        />
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, ${wedding.colors?.primary || '#ff90f0'}20 0%, ${wedding.colors?.secondary || '#e826a1'}20 100%)`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                        {t.lastName}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium placeholder-gray-400"
                          style={{
                            borderColor: wedding.colors?.primary || '#ff90f0',
                            color: wedding.colors?.text || '#1f2937',
                            '--tw-ring-color': wedding.colors?.primary || '#ff90f0'
                          }}
                          placeholder="Enter your last name"
                          required
                        />
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, ${wedding.colors?.secondary || '#e826a1'}20 0%, ${wedding.colors?.primary || '#ff90f0'}20 100%)`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Selection with Beautiful Cards */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      {t.attending}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group">
                        <input
                          type="radio"
                          name="attending"
                          value="true"
                          checked={formData.attending === true}
                          onChange={(e) => handleChange('attending', e.target.value === 'true')}
                          className="hidden"
                          required
                          id="attending-yes"
                        />
                        <label 
                          htmlFor="attending-yes"
                          className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.attending === true 
                              ? 'border-green-400 bg-green-50' 
                              : 'border-gray-200 group-hover:border-green-300 group-hover:bg-green-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-semibold text-gray-800 mb-2">🎉 {t.yes}</div>
                              <div className="text-sm text-gray-600">I'm excited to celebrate with you!</div>
                            </div>
                            <div className={`w-6 h-6 border-2 rounded-full transition-colors ${
                              formData.attending === true 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300 group-hover:border-green-500'
                            }`}>
                              {formData.attending === true && (
                                <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="group">
                        <input
                          type="radio"
                          name="attending"
                          value="false"
                          checked={formData.attending === false}
                          onChange={(e) => handleChange('attending', e.target.value === 'true')}
                          className="hidden"
                          required
                          id="attending-no"
                        />
                        <label 
                          htmlFor="attending-no"
                          className={`block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            formData.attending === false 
                              ? 'border-red-400 bg-red-50' 
                              : 'border-gray-200 group-hover:border-red-300 group-hover:bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-semibold text-gray-800 mb-2">💝 {t.no}</div>
                              <div className="text-sm text-gray-600">I'll be there in spirit!</div>
                            </div>
                            <div className={`w-6 h-6 border-2 rounded-full transition-colors ${
                              formData.attending === false 
                                ? 'border-red-500 bg-red-500' 
                                : 'border-gray-300 group-hover:border-red-500'
                            }`}>
                              {formData.attending === false && (
                                <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Connection Type - Only show if attending */}
                  {formData.attending && (
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                        {t.connectionType}
                      </label>
                      <div className="relative">
                        <select
                          value={formData.connectionType}
                          onChange={(e) => handleChange('connectionType', e.target.value)}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium appearance-none"
                          style={{
                            borderColor: wedding.colors?.primary || '#ff90f0',
                            color: wedding.colors?.text || '#1f2937',
                            '--tw-ring-color': wedding.colors?.primary || '#ff90f0'
                          }}
                          required
                        >
                          <option value="">Select your connection to the couple</option>
                          {wedding.connectionOptions?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  )}

                  {/* Guest Count - Only show if attending */}
                  {formData.attending && (
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors">
                        {t.guestCount}
                      </label>
                      <div className="relative">
                        <select
                          value={formData.guestCount}
                          onChange={(e) => handleChange('guestCount', parseInt(e.target.value))}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium appearance-none"
                          style={{
                            borderColor: wedding.colors?.primary || '#ff90f0',
                            color: wedding.colors?.text || '#1f2937',
                            '--tw-ring-color': wedding.colors?.primary || '#ff90f0'
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'guest' : 'guests'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button with Beautiful Styling */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${wedding.colors?.primary || '#ff90f0'} 0%, ${wedding.colors?.secondary || '#e826a1'} 100%)`
                      }}
                    >
                      {submitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      ) : (
                        <Heart className="h-6 w-6 mr-3" />
                      )}
                      {submitting ? 'Sending your RSVP...' : t.submit}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <AdminLoginModal 
          onClose={() => setShowAdminModal(false)}
          weddingId={wedding.weddingId}
        />
      )}
    </div>
  );
};

export default RSVPForm; 