# RSVP Manager Deployment Guide

## Environment Variables Setup

### For Development:
The application will automatically use `http://localhost:5000` as the API URL when no environment variable is set.

### For Production:
Set the environment variable in Render Static Site:

**Key:** `REACT_APP_API_URL`
**Value:** `https://rsvp-manager-api.onrender.com`

## Build and Deploy

### 1. Build the Application
```bash
cd client
npm run build
```

### 2. Deploy to Render

#### For the Frontend (rsvp-manager-client):
1. Connect your GitHub repository to Render
2. Set the build command: `cd client && npm install && npm run build`
3. Set the publish directory: `client/build`
4. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://rsvp-manager-api.onrender.com`

#### For the Backend (rsvp-manager-api):
1. Connect your GitHub repository to Render
2. Set the build command: `npm install`
3. Set the start command: `npm start`
4. Set the root directory: `server`

## Environment Variables Summary

| Variable | Development | Production |
|----------|-------------|------------|
| REACT_APP_API_URL | http://localhost:5000 | https://rsvp-manager-api.onrender.com |

## API Endpoints

The application now uses dynamic API URLs based on the environment:

- **Development**: `http://localhost:5000/api/*`
- **Production**: `https://rsvp-manager-api.onrender.com/api/*`

## Troubleshooting

### If API calls fail in production:
1. Check that the `REACT_APP_API_URL` environment variable is set correctly
2. Verify the backend API is running and accessible
3. Check CORS settings on the backend
4. Ensure the API endpoints are working

### If the build fails:
1. Make sure all dependencies are installed: `npm install`
2. Check for any syntax errors in the code
3. Verify that all imports are correct

## Notes

- The application now uses absolute URLs instead of relative URLs
- The proxy setting has been removed from package.json
- All API calls now use the `API_URL` from the config file
- The build process will automatically use the correct API URL based on the environment 