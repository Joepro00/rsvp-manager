const express = require('express');
const { getDatabase } = require('../database');
const router = express.Router();

// Submit RSVP response
router.post('/:weddingId/submit', (req, res) => {
  const { weddingId } = req.params;
  const {
    firstName,
    lastName,
    attending,
    connectionType,
    guestCount = 1
  } = req.body;

  if (!firstName || !lastName || attending === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // If attending, connection type is required
  if (attending && !connectionType) {
    return res.status(400).json({ error: 'Connection type is required when attending' });
  }

  const db = getDatabase();
  
  // First verify the wedding exists
  db.get('SELECT * FROM weddings WHERE wedding_id = ?', [weddingId], (err, wedding) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Insert RSVP response
    const sql = `
      INSERT INTO rsvp_responses (
        wedding_id, first_name, last_name, attending, 
        connection_type, guest_count
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      weddingId,
      firstName,
      lastName,
      attending ? 1 : 0,
      connectionType || null,
      attending ? guestCount : 1
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to submit RSVP' });
      }

      res.json({
        success: true,
        message: 'Thank you for RSVPing!',
        rsvpId: this.lastID
      });
    });
  });
});

// Get RSVP responses for a wedding
router.get('/:weddingId/responses', (req, res) => {
  const { weddingId } = req.params;
  const { filter } = req.query; // 'all', 'attending', 'not-attending'

  let sql = 'SELECT * FROM rsvp_responses WHERE wedding_id = ?';
  const params = [weddingId];

  if (filter === 'attending') {
    sql += ' AND attending = 1';
  } else if (filter === 'not-attending') {
    sql += ' AND attending = 0';
  }

  sql += ' ORDER BY submitted_at DESC';

  const db = getDatabase();
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const responses = rows.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      attending: Boolean(row.attending),
      connectionType: row.connection_type,
      guestCount: row.guest_count,
      submittedAt: row.submitted_at
    }));

    res.json({ responses });
  });
});

// Get RSVP statistics for a wedding
router.get('/:weddingId/statistics', (req, res) => {
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
      statistics: {
        total,
        attending,
        notAttending,
        connectionBreakdown,
        guestCount,
        responseRate: total > 0 ? Math.round((total / (total + 50)) * 100) : 0 // Mock response rate
      }
    });
  });
});

// Export guest list as CSV
router.get('/:weddingId/export', (req, res) => {
  const { weddingId } = req.params;
  const { filter = 'all' } = req.query;

  let sql = 'SELECT * FROM rsvp_responses WHERE wedding_id = ?';
  const params = [weddingId];

  if (filter === 'attending') {
    sql += ' AND attending = 1';
  } else if (filter === 'not-attending') {
    sql += ' AND attending = 0';
  }

  sql += ' ORDER BY last_name, first_name';

  const db = getDatabase();
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Create CSV content
    const csvHeaders = 'First Name,Last Name,Attending,Connection Type,Guest Count,Submitted Date\n';
    const csvRows = rows.map(row => {
      return `"${row.first_name}","${row.last_name}","${row.attending ? 'Yes' : 'No'}","${row.connection_type || ''}","${row.guest_count || 1}","${row.submitted_at}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="guest-list-${weddingId}-${filter}.csv"`);
    res.send(csvContent);
  });
});

// Get wedding details for RSVP form
router.get('/:weddingId/details', (req, res) => {
  const { weddingId } = req.params;
  
  if (!weddingId) {
    return res.status(400).json({ error: 'Wedding ID is required' });
  }
  
  const db = getDatabase();
  db.get('SELECT * FROM weddings WHERE wedding_id = ?', [weddingId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    try {
      const wedding = {
        weddingId: row.wedding_id,
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
        connectionOptions: row.connection_options ? JSON.parse(row.connection_options) : []
      };
      
      res.json({ wedding });
    } catch (parseError) {
      console.error('Error parsing wedding data:', parseError);
      return res.status(500).json({ error: 'Error processing wedding data' });
    }
  });
});

// Delete RSVP response
router.delete('/:weddingId/responses/:responseId', (req, res) => {
  const { weddingId, responseId } = req.params;
  
  if (!responseId) {
    return res.status(400).json({ error: 'Response ID is required' });
  }

  const db = getDatabase();
  
  // First verify the wedding exists
  db.get('SELECT * FROM weddings WHERE wedding_id = ?', [weddingId], (err, wedding) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!wedding) {
      return res.status(404).json({ error: 'Wedding not found' });
    }

    // Delete the RSVP response
    db.run('DELETE FROM rsvp_responses WHERE id = ? AND wedding_id = ?', [responseId, weddingId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete RSVP' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'RSVP response not found' });
      }

      res.json({
        success: true,
        message: 'RSVP response deleted successfully'
      });
    });
  });
});

module.exports = router; 