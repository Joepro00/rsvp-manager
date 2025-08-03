const express = require('express');
const { getDatabase } = require('../database');
const router = express.Router();

// Master admin login
router.post('/master-login', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Master code is required' });
  }

  const db = getDatabase();
  db.get('SELECT * FROM master_admin WHERE code = ?', [code], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid master code' });
    }

    res.json({ 
      success: true, 
      message: 'Master admin access granted',
      isMasterAdmin: true
    });
  });
});

// Wedding admin login
router.post('/wedding-login', (req, res) => {
  const { adminCode } = req.body;
  
  if (!adminCode) {
    return res.status(400).json({ error: 'Admin code is required' });
  }

  const db = getDatabase();
  db.get('SELECT * FROM weddings WHERE admin_code = ?', [adminCode], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid admin code' });
    }

    res.json({ 
      success: true, 
      message: 'Wedding admin access granted',
      wedding: {
        weddingId: row.wedding_id,
        brideName: row.bride_name,
        groomName: row.groom_name,
        weddingDate: row.wedding_date,
        ceremonyTime: row.ceremony_time,
        venueDetails: row.venue_details,
        welcomeMessage: row.welcome_message,
        language: row.language,
        colors: row.colors ? JSON.parse(row.colors) : {},
        fonts: row.fonts ? JSON.parse(row.fonts) : {},
        layoutStyle: row.layout_style,
        connectionOptions: row.connection_options ? JSON.parse(row.connection_options) : []
      }
    });
  });
});

// Verify master admin access
router.get('/verify-master', (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Master code is required' });
  }

  const db = getDatabase();
  db.get('SELECT * FROM master_admin WHERE code = ?', [code], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid master code' });
    }

    res.json({ 
      success: true, 
      isMasterAdmin: true
    });
  });
});

module.exports = router; 