# Backend - Animal Rescue Network

This backend provides the REST API and real-time messaging support for the Animal Rescue Network application.

## Overview

The backend is built with Node.js, Express, MongoDB, Mongoose, JWT authentication, file uploads via Multer/Cloudinary, and Socket.IO for real-time chat.

### Key Responsibilities

- User authentication and profile management
- Rescue report creation and status updates
- Adoption listing creation, QR generation, application workflow, and approval handling
- Lost & Found reporting and resolution
- Volunteer registration, assignment, and rescue tracking
- Donation processing and donor history
- Notification storage and management
- Admin analytics, user moderation, and rescue moderation
- Real-time chat socket support

## Folder Structure

```text
backend/
├── config/       # MongoDB connection logic
├── controllers/  # Request handlers for each feature domain
├── middleware/   # Auth guard, upload handling, error handling
├── models/       # Mongoose schemas for User, RescueReport, Animal, etc.
├── routes/       # API endpoint definitions
├── socket/       # Socket.IO event handling
├── server.js     # App entrypoint and Socket.IO initialization
├── package.json  # Backend dependencies and scripts
└── .env          # Environment variables (not committed)
```

## Environment Variables

Create a `.env` file in `backend/` with:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/animal-rescue?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

## Installation

```bash
cd backend
npm install
```

## Run Locally

```bash
npm run dev
```

The backend server runs on `http://localhost:5000` by default.

## API Routes

### Authentication
- `POST /api/auth/register` — register new users
- `POST /api/auth/login` — login and receive JWT token
- `GET /api/auth/profile` — get authenticated user profile
- `PUT /api/auth/profile` — update profile and avatar upload
- `GET /api/auth/users` — admin-only user listing

### Rescue Reports
- `POST /api/rescue` — create new rescue report
- `GET /api/rescue` — get rescue reports
- `GET /api/rescue/:id` — get rescue report details
- `PUT /api/rescue/:id/accept` — accept a rescue report
- `PUT /api/rescue/:id/status` — update report status
- `DELETE /api/rescue/:id` — delete rescue report

### Adoption
- `POST /api/adoption` — add animal listing
- `POST /api/adoption/generate-qr` — generate QR for animal
- `GET /api/adoption` — list adoptable animals
- `GET /api/adoption/:id` — get animal details
- `POST /api/adoption/:id/apply` — submit adoption application
- `PUT /api/adoption/:id/request/:requestId` — approve/reject adoption application
- `DELETE /api/adoption/:id` — delete animal listing
- `POST /api/adoption/:id/regenerate-qr` — regenerate QR token

### Lost & Found
- `POST /api/lostfound` — create lost or found report
- `GET /api/lostfound` — list lost & found reports
- `GET /api/lostfound/:id` — get report details
- `PUT /api/lostfound/:id/resolve` — resolve report
- `DELETE /api/lostfound/:id` — delete report

### Volunteers
- `POST /api/volunteers/register` — register as volunteer
- `GET /api/volunteers/me` — get volunteer profile
- `GET /api/volunteers` — admin-only volunteer list
- `PUT /api/volunteers/:id/assign/:rescueId` — assign rescue to volunteer
- `PUT /api/volunteers/complete/:rescueId` — mark rescue complete
- `PUT /api/volunteers/:id/status` — update volunteer status

### Donations
- `POST /api/donations` — submit a donation
- `GET /api/donations/me` — current user donation history
- `GET /api/donations` — admin-only donation list

### Notifications
- `GET /api/notifications` — fetch notifications
- `PUT /api/notifications/read-all` — mark all as read
- `PUT /api/notifications/:id/read` — mark as read
- `DELETE /api/notifications/:id` — remove notification

### Admin
- `GET /api/admin/analytics` — fetch usage analytics
- `GET /api/admin/users` — list all users
- `PUT /api/admin/users/:id/block` — block/unblock user
- `PUT /api/admin/users/:id/verify` — verify rescue team
- `DELETE /api/admin/users/:id` — delete user
- `DELETE /api/admin/rescue/:id` — delete rescue report

## Notes

- `backend/server.js` supports CORS for `http://localhost:5173` and Vercel deployments.
- `backend/config/db.js` retries MongoDB connection when the database is temporarily unavailable.
- `backend/middleware/authMiddleware.js` protects routes and enforces role checks.
- `backend/middleware/uploadMiddleware.js` handles file uploads and Cloudinary storage.

## Useful Scripts

- `npm run dev` — start server with `nodemon`
- `npm start` — start server with Node

## Testing & Postman

A Postman or API testing collection can be created from the above routes. Use JWT bearer tokens from login for protected endpoints.
