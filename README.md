# RSVP Manager

A complete wedding RSVP management system built with React, Node.js, and SQLite. Manage multiple weddings, customize RSVP forms, and track guest responses.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
2. **Run the setup script:**
   ```bash
   # Windows
   start.bat
   
   # Or manually:
   npm install
   cd client && npm install && cd ..
   npm run dev
   ```

3. **Access the application:**
   - Client: http://localhost:3000
   - Server: http://localhost:5000
   - Master Admin Code: `tamar123`

## 🎯 Features

### Master Admin
- Create and manage multiple weddings
- Generate unique admin codes for each wedding
- View all wedding statistics

### Wedding Admin
- Customize wedding details and RSVP form
- Track guest responses and statistics
- Export guest lists as CSV
- Preview RSVP form before publishing

### Public RSVP Form
- Beautiful, customizable RSVP forms
- Multi-language support (English/Hebrew)
- Countdown timer to wedding day
- Mobile-responsive design

## 🛠️ Recent Bug Fixes

### Fixed Issues:
1. **Missing Tailwind CSS dependencies** - Added required devDependencies
2. **Database table creation errors** - Added `IF NOT EXISTS` to prevent conflicts
3. **Error handling improvements** - Better error messages and logging
4. **JSON parsing errors** - Added try-catch blocks for JSON operations
5. **Missing PostCSS config** - Added PostCSS configuration for Tailwind
6. **React error boundaries** - Added ErrorBoundary component
7. **Form validation** - Improved input validation and error messages
8. **Authentication feedback** - Added success/error toasts for login
9. **Database connection issues** - Improved database initialization
10. **Missing CSS classes** - Fixed form input styling

### Technical Improvements:
- Better error handling throughout the application
- Improved database schema with proper constraints
- Enhanced user feedback with toast notifications
- Added error boundaries for React components
- Fixed styling issues with form inputs
- Improved authentication flow with proper feedback

## 📁 Project Structure

```
rsvp-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/           # Database setup
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
└── package.json
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start both client and server
- `npm run server` - Start server only
- `npm run client` - Start client only
- `npm run build` - Build for production

### Database
The application uses SQLite for data storage. The database file is automatically created at `server/database/rsvp_manager.db`.

## 🎨 Customization

### Wedding Customization
- Colors and fonts
- Layout styles
- Countdown timer styles
- Connection options for guests
- Welcome messages

### RSVP Form Features
- Multi-language support
- Guest count selection
- Connection type selection
- Beautiful animations and styling

## 🚨 Troubleshooting

### Common Issues:
1. **Port already in use**: Change ports in package.json scripts
2. **Database errors**: Delete `server/database/rsvp_manager.db` and restart
3. **Missing dependencies**: Run `npm install` in both root and client directories
4. **Tailwind not working**: Ensure PostCSS config is present

### Getting Help:
- Check the browser console for errors
- Check the server console for backend errors
- Ensure all dependencies are installed
- Verify Node.js version is 16 or higher

## 📝 License

MIT License - feel free to use this project for your own wedding RSVP management needs! 