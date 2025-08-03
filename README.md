# RSVP Manager API

A complete RSVP management system API for multiple weddings.

## Features

- **Master Admin Dashboard**: Manage multiple weddings from one place
- **Wedding Admin Interface**: Individual wedding management
- **RSVP Collection**: Guest response collection with custom forms
- **Guest Management**: Add, edit, delete, and export guest lists
- **Duplicate Detection**: Smart fuzzy matching for duplicate entries
- **Bulk Operations**: Delete multiple duplicates at once
- **API-First Design**: RESTful API for frontend integration

## API Endpoints

### Authentication
- `POST /api/auth/master-login` - Master admin login
- `POST /api/auth/wedding-login` - Wedding admin login

### Weddings
- `GET /api/weddings` - Get all weddings (master admin)
- `POST /api/weddings` - Create new wedding
- `PUT /api/weddings/:id` - Update wedding
- `DELETE /api/weddings/:id` - Delete wedding

### RSVP
- `GET /api/rsvp/:weddingId/details` - Get wedding details for RSVP form
- `POST /api/rsvp/:weddingId/submit` - Submit RSVP response
- `GET /api/rsvp/:weddingId/responses` - Get all responses for a wedding
- `GET /api/rsvp/:weddingId/statistics` - Get wedding statistics
- `DELETE /api/rsvp/:weddingId/responses/:responseId` - Delete individual RSVP
- `GET /api/rsvp/:weddingId/export` - Export guest list

### Health Check
- `GET /api/health` - API health status

## Deployment

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Local Development
```bash
cd server
npm install
npm run dev
```

### Production Deployment (Render)
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && node index.js`
- **Root Directory**: (leave blank)

## Database

Uses SQLite database with the following tables:
- `master_admin` - Master admin credentials
- `weddings` - Wedding configurations
- `rsvp_responses` - Guest responses

## Security Features

- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation
- Error handling

## Master Admin Access

Default master admin code: `tamar123`

## Technologies

- Node.js
- Express.js
- SQLite
- UUID
- Moment.js
- bcryptjs
- Helmet
- CORS