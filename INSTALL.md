# RSVP Manager - Installation Guide

## Prerequisites

Before installing RSVP Manager, you need to have the following installed:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - This will also install npm (Node Package Manager)

2. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Installation Steps

### Method 1: Using Setup Scripts (Recommended)

#### For Windows Command Prompt:
1. Open Command Prompt in the project directory
2. Run: `setup.bat`

#### For Windows PowerShell:
1. Open PowerShell in the project directory
2. Run: `.\setup.ps1`

### Method 2: Manual Installation

1. **Install Server Dependencies**
   ```bash
   npm install
   ```

2. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

## Starting the Application

After installation, start the application with:

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Accessing the Application

1. **Frontend**: Open http://localhost:3000 in your web browser
2. **Backend API**: Available at http://localhost:5000/api

## First Time Setup

1. **Master Admin Login**:
   - Go to http://localhost:3000
   - Click "Master Admin" tab
   - Enter code: `tamar123`
   - Click "Access Manager"

2. **Create Your First Wedding**:
   - Click "Create Wedding" button
   - Fill in the wedding details
   - Save the wedding

3. **Share the RSVP Link**:
   - Copy the generated RSVP link
   - Share with your guests
   - Save the admin code for wedding management

## Troubleshooting

### Node.js Not Found
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt
- Run the setup script again

### Port Already in Use
- Close other applications using ports 3000 or 5000
- Or change ports in the configuration files

### Installation Errors
- Make sure you have a stable internet connection
- Try running `npm cache clean --force`
- Delete `node_modules` folders and reinstall

### Database Issues
- The SQLite database will be created automatically
- Check file permissions in the `server/database` folder

## Development Commands

```bash
# Start development servers
npm run dev

# Start only the backend server
npm run server

# Start only the frontend
npm run client

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

## File Structure

```
rsvp-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js backend
│   ├── database/          # Database files
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── package.json           # Root dependencies
├── setup.bat             # Windows setup script
├── setup.ps1             # PowerShell setup script
└── README.md             # Main documentation
```

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console output for error messages
3. Make sure all prerequisites are installed
4. Try the manual installation method

## Next Steps

After successful installation:

1. Create your first wedding
2. Customize the wedding settings
3. Share the RSVP link with guests
4. Monitor responses through the dashboard
5. Export guest lists as needed

---

**Happy Wedding Planning! 💒** 