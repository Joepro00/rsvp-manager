const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'rsvp_manager.db');
let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('📊 Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    // First, create the master_admin table
    const createMasterAdminTable = `CREATE TABLE IF NOT EXISTS master_admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    // Then create the weddings table
    const createWeddingsTable = `CREATE TABLE IF NOT EXISTS weddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wedding_id TEXT UNIQUE NOT NULL,
      admin_code TEXT UNIQUE NOT NULL,
      bride_name TEXT NOT NULL,
      groom_name TEXT NOT NULL,
      wedding_date TEXT NOT NULL,
      ceremony_time TEXT NOT NULL,
      venue_details TEXT,
      venue TEXT,
      venue_address TEXT,
      welcome_message TEXT,
      language TEXT DEFAULT 'en',
      colors TEXT,
      fonts TEXT,
      layout_style TEXT DEFAULT 'modern',
      countdown_style TEXT DEFAULT 'digital',
      connection_options TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    // Finally create the RSVP responses table
    const createRSVPTable = `CREATE TABLE IF NOT EXISTS rsvp_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wedding_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      attending BOOLEAN NOT NULL,
      connection_type TEXT,
      guest_count INTEGER DEFAULT 1,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wedding_id) REFERENCES weddings (wedding_id)
    )`;

    // Execute tables in sequence to avoid conflicts
    db.run(createMasterAdminTable, (err) => {
      if (err) {
        console.error('Error creating master_admin table:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Master admin table created');

      db.run(createWeddingsTable, (err) => {
        if (err) {
          console.error('Error creating weddings table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Weddings table created');

        db.run(createRSVPTable, (err) => {
          if (err) {
            console.error('Error creating rsvp_responses table:', err.message);
            reject(err);
            return;
          }
          console.log('✅ RSVP responses table created');
          console.log('✅ Database tables created successfully');
          
          // Initialize master admin after all tables are created
          initializeMasterAdmin().then(resolve).catch(reject);
        });
      });
    });
  });
};

const initializeMasterAdmin = () => {
  return new Promise((resolve, reject) => {
    const masterCode = 'tamar123';
    
    // First, check if the table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='master_admin'", (err, row) => {
      if (err) {
        console.error('Error checking if master_admin table exists:', err.message);
        reject(err);
        return;
      }
      
      if (!row) {
        console.error('master_admin table does not exist');
        reject(new Error('master_admin table does not exist'));
        return;
      }
      
      // Now check if the master admin code exists
      db.get('SELECT * FROM master_admin WHERE code = ?', [masterCode], (err, row) => {
        if (err) {
          console.error('Error checking master admin code:', err.message);
          reject(err);
          return;
        }
        
        if (!row) {
          // Insert the master admin code
          db.run('INSERT INTO master_admin (code) VALUES (?)', [masterCode], (err) => {
            if (err) {
              console.error('Error inserting master admin code:', err.message);
              reject(err);
              return;
            }
            console.log('🔑 Master admin code initialized');
            resolve();
          });
        } else {
          console.log('🔑 Master admin code already exists');
          resolve();
        }
      });
    });
  });
};

const getDatabase = () => {
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('📊 Database connection closed');
      }
    });
  }
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase
}; 