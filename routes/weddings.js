const express = require('express');
const { getDatabase } = require('../database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Get all weddings (master admin only)
router.get('/', (req, res) => {
  const db = getDatabase();
  db.all('SELECT * FROM weddings ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const weddings = rows.map(row => ({
      weddingId: row.wedding_id,
      adminCode: row.admin_code,
      brideName: row.bride_name,
      groomName: row.groom_name,
      weddingDate: row.wedding_date,
      ceremonyTime: row.ceremony_time,
      venueDetails: row.venue_details,
      venue: row.venue,
      venueAddress: row.venue_address,
      welcomeMessage: row.welcome_message,
      language: row.language,
      colors: row.colors ? JSON.parse(row.colors) : {},
      fonts: row.fonts ? JSON.parse(row.fonts) : {},
      layoutStyle: row.layout_style,
      countdownStyle: row.countdown_style,
      connectionOptions: row.connection_options ? JSON.parse(row.connection_options) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({ weddings });
  });
});

// Create new wedding
router.post('/', (req, res) => {
  const {
    brideName,
    groomName,
    weddingDate,
    ceremonyTime,
    venueDetails,
    venue,
    venueAddress,
    welcomeMessage,
    language = 'en',
    colors = {},
    fonts = {},
    layoutStyle = 'modern',
    countdownStyle = 'digital',
    connectionOptions = []
  } = req.body;

  if (!brideName || !groomName || !weddingDate || !ceremonyTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const weddingId = `wedding-${uuidv4().substring(0, 8).toUpperCase()}`;
  const adminCode = `admin-${uuidv4().substring(0, 8).toUpperCase()}`;

  const db = getDatabase();
  const sql = `
    INSERT INTO weddings (
      wedding_id, admin_code, bride_name, groom_name, wedding_date, 
      ceremony_time, venue_details, venue, venue_address, welcome_message, language, 
      colors, fonts, layout_style, countdown_style, connection_options
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    weddingId,
    adminCode,
    brideName,
    groomName,
    weddingDate,
    ceremonyTime,
    venueDetails || '',
    venue || '',
    venueAddress || '',
    welcomeMessage || '',
    language,
    JSON.stringify(colors),
    JSON.stringify(fonts),
    layoutStyle,
    countdownStyle,
    JSON.stringify(connectionOptions)
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      console.error('SQL:', sql);
      console.error('Params:', params);
      return res.status(500).json({ error: 'Failed to create wedding' });
    }

    res.json({
      success: true,
      wedding: {
        weddingId,
        adminCode,
        brideName,
        groomName,
        weddingDate,
        ceremonyTime,
        venueDetails,
        venue,
        venueAddress,
        welcomeMessage,
        language,
        colors,
        fonts,
        layoutStyle,
        countdownStyle,
        connectionOptions
      }
    });
  });
});

// Get wedding by ID
router.get('/:weddingId', (req, res) => {
  const { weddingId } = req.params;
  
  const db = getDatabase();
  db.get('SELECT * FROM weddings WHERE wedding_id = ?', [weddingId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    res.json({
      wedding: {
        weddingId: row.wedding_id,
        adminCode: row.admin_code,
        brideName: row.bride_name,
        groomName: row.groom_name,
        weddingDate: row.wedding_date,
        ceremonyTime: row.ceremony_time,
        venueDetails: row.venue_details,
        venue: row.venue,
        venueAddress: row.venue_address,
        welcomeMessage: row.welcome_message,
        language: row.language,
        colors: row.colors ? JSON.parse(row.colors) : {},
        fonts: row.fonts ? JSON.parse(row.fonts) : {},
        layoutStyle: row.layout_style,
        countdownStyle: row.countdown_style,
        connectionOptions: row.connection_options ? JSON.parse(row.connection_options) : [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  });
});

// Update wedding
router.put('/:weddingId', (req, res) => {
  const { weddingId } = req.params;
  const {
    brideName,
    groomName,
    weddingDate,
    ceremonyTime,
    venueDetails,
    venue,
    venueAddress,
    welcomeMessage,
    language,
    colors,
    fonts,
    layoutStyle,
    countdownStyle,
    connectionOptions
  } = req.body;

  const db = getDatabase();
  const sql = `
    UPDATE weddings SET 
      bride_name = ?, groom_name = ?, wedding_date = ?, ceremony_time = ?,
      venue_details = ?, venue = ?, venue_address = ?, welcome_message = ?, language = ?, colors = ?,
      fonts = ?, layout_style = ?, countdown_style = ?, connection_options = ?, updated_at = CURRENT_TIMESTAMP
    WHERE wedding_id = ?
  `;

  const params = [
    brideName,
    groomName,
    weddingDate,
    ceremonyTime,
    venueDetails || '',
    venue || '',
    venueAddress || '',
    welcomeMessage || '',
    language || 'en',
    JSON.stringify(colors || {}),
    JSON.stringify(fonts || {}),
    layoutStyle || 'modern',
    countdownStyle || 'digital',
    JSON.stringify(connectionOptions || []),
    weddingId
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update wedding' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    res.json({ success: true, message: 'Wedding updated successfully' });
  });
});

// Delete wedding
router.delete('/:weddingId', (req, res) => {
  const { weddingId } = req.params;
  
  const db = getDatabase();
  
  // First delete all RSVP responses for this wedding
  db.run('DELETE FROM rsvp_responses WHERE wedding_id = ?', [weddingId], (err) => {
    if (err) {
      console.error('Error deleting RSVP responses:', err);
      return res.status(500).json({ error: 'Failed to delete RSVP responses' });
    }

    // Then delete the wedding
    db.run('DELETE FROM weddings WHERE wedding_id = ?', [weddingId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete wedding' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Wedding not found' });
      }

      res.json({ success: true, message: 'Wedding deleted successfully' });
    });
  });
});

// Get wedding statistics
router.get('/:weddingId/stats', (req, res) => {
  const { weddingId } = req.params;
  
  const db = getDatabase();
  db.all('SELECT * FROM rsvp_responses WHERE wedding_id = ?', [weddingId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const total = rows.length;
    const attending = rows.filter(r => r.attending).length;
    const notAttending = total - attending;
    
    const connectionBreakdown = {};
    rows.forEach(row => {
      if (row.connection_type) {
        connectionBreakdown[row.connection_type] = (connectionBreakdown[row.connection_type] || 0) + 1;
      }
    });

    const guestCount = rows.reduce((sum, row) => sum + (row.guest_count || 1), 0);

    res.json({
      stats: {
        total,
        attending,
        notAttending,
        connectionBreakdown,
        guestCount
      }
    });
  });
});

module.exports = router; 