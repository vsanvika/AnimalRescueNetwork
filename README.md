# Animal Rescue Network 🐾

Animal Rescue Network is a full-stack animal rescue platform built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Socket.IO.
It connects citizens, rescue teams, volunteers, donors, and administrators to report animal emergencies, manage adoption listings, file lost & found reports, chat in real time, donate, and track rescue operations.

## Repository Layout

```text
AnimalRescueNetwork/
├── backend/          # API server, authentication, routes, MongoDB models, Socket.IO
│   ├── config/       # Database and cloud storage config
│   ├── controllers/  # Route handlers for auth, rescue, adoption, etc.
│   ├── middleware/   # Auth guard, file upload handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express route definitions
│   ├── socket/       # Socket.IO handlers for real-time chat
│   └── server.js     # Express app and Socket.IO server entrypoint
└── frontend/         # React application with Vite and Tailwind CSS
    ├── api/          # Axios API client with auth interceptor
    ├── components/   # Reusable UI components
    ├── pages/        # Main application views and forms
    ├── store/        # Client state management with Zustand
    └── main.jsx      # App bootstrap
```

## Features

- Authentication with register/login and JWT-based protected routes
- Role-based access for Users, Rescue Team members, and Admins
- Rescue reporting with emergency level, GPS capture, file upload, and status tracking
- Adoption listings with animal details, images, application workflow, and QR generation
- Lost & Found reporting with contact info, multiple images, and open/resolve flow
- Real-time chat between users and rescue team members using Socket.IO
- Volunteer registration and management
- Donation checkout with amount entry, history, and admin reporting
- Notifications for user actions and application events
- Admin analytics, user management, verification, and moderation tools

## Tech Stack

- Frontend:
  - React 19
  - Vite
  - Tailwind CSS 4
  - React Router DOM 7
  - Zustand
  - Axios
  - Socket.IO Client
  - React Leaflet / Leaflet
  - QR code generation with `qrcode`
- Backend:
  - Node.js
  - Express 5
  - MongoDB + Mongoose
  - JSON Web Tokens (JWT)
  - Socket.IO
  - Multer + Cloudinary image upload
  - bcryptjs password hashing
  - dotenv, cors, cookie-parser

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB instance (Atlas or local)
- Cloudinary account for image uploads (optional but recommended)

### Root installation

Install dependencies for both frontend and backend from repository root:

```bash
cd AnimalRescueNetwork
cd backend && npm install
cd ../frontend && npm install
```

### Backend Setup

1. `cd backend`
2. Create a `.env` file with these variables:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/animal-rescue?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

3. Start the backend server:

```bash
npm run dev
```

The backend listens on `http://localhost:5000` by default and mounts API routes under `/api`.

### Frontend Setup

1. `cd frontend`
2. Create a `.env` file with these variables:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

3. Start the frontend app:

```bash
npm run dev
```

The frontend runs with Vite and should open at `http://localhost:5173`.

## API Overview

### Auth
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/auth/profile` — get current user profile
- `PUT /api/auth/profile` — update profile and upload avatar
- `GET /api/auth/users` — admin user list

### Rescue Reports
- `POST /api/rescue` — create a new rescue report (protected)
- `GET /api/rescue` — list reports (protected)
- `GET /api/rescue/:id` — report details (protected)
- `PUT /api/rescue/:id/accept` — accept rescue (rescue team/admin)
- `PUT /api/rescue/:id/status` — change report status (rescue team/admin)
- `DELETE /api/rescue/:id` — delete a report (rescue team/admin)

### Adoption
- `POST /api/adoption` — add an adoption animal (rescue/admin)
- `POST /api/adoption/generate-qr` — generate QR data for an animal
- `GET /api/adoption` — list adoptable animals
- `GET /api/adoption/:id` — adoption details
- `POST /api/adoption/:id/apply` — apply for adoption (protected)
- `PUT /api/adoption/:id/request/:requestId` — approve/reject application (rescue/admin)
- `DELETE /api/adoption/:id` — remove adoption listing (rescue/admin)
- `POST /api/adoption/:id/regenerate-qr` — regenerate QR token

### Lost & Found
- `POST /api/lostfound` — create lost/found report (protected)
- `GET /api/lostfound` — list reports
- `GET /api/lostfound/:id` — report detail
- `PUT /api/lostfound/:id/resolve` — resolve report (protected)
- `DELETE /api/lostfound/:id` — delete report (protected)

### Chat
- `POST /api/chat/conversation` — create or fetch conversation (protected)
- `GET /api/chat/conversations` — get user conversations (protected)
- `GET /api/chat/messages/:conversationId` — fetch messages (protected)
- `POST /api/chat/messages` — send a chat message (protected)

### Volunteers
- `POST /api/volunteers/register` — register volunteer profile (protected)
- `GET /api/volunteers/me` — get volunteer profile (protected)
- `GET /api/volunteers` — list volunteers (admin)
- `PUT /api/volunteers/:id/assign/:rescueId` — assign rescue (admin)
- `PUT /api/volunteers/complete/:rescueId` — complete rescue
- `PUT /api/volunteers/:id/status` — update volunteer status (admin)

### Donations
- `POST /api/donations` — create a donation (protected)
- `GET /api/donations/me` — donation history for current user
- `GET /api/donations` — admin donation management

### Notifications
- `GET /api/notifications` — fetch notifications (protected)
- `PUT /api/notifications/read-all` — mark all as read
- `PUT /api/notifications/:id/read` — mark one notification read
- `DELETE /api/notifications/:id` — delete notification

### Admin
- `GET /api/admin/analytics` — site analytics
- `GET /api/admin/users` — list all users
- `PUT /api/admin/users/:id/block` — block/unblock user
- `PUT /api/admin/users/:id/verify` — verify rescue team member
- `DELETE /api/admin/users/:id` — delete user
- `DELETE /api/admin/rescue/:id` — delete rescue report

## Frontend Notes

- `frontend/src/api/axios.js` configures the API client with `VITE_API_URL`, JWT token injection, and 401 handling.
- UI pages include login/register, home, dashboard, adoption listing, rescue report, lost & found, volunteers, donations, profile, admin panel, chat, and QR scanner.
- The app uses Tailwind CSS utility classes and reusable components such as `Navbar`, `Footer`, `AnimalCard`, `ChatWindow`, `MapView`, and `QRScanner`.

## Backend Notes

- `backend/server.js` sets up Express, Socket.IO, CORS, JSON parsing, cookies, and error handling.
- `backend/config/db.js` connects to MongoDB and retries automatically if the first connection fails.
- `backend/middleware/authMiddleware.js` protects routes and enforces role-based access.
- `backend/middleware/uploadMiddleware.js` handles file uploads and Cloudinary integration.

## Roles Overview

- **User** — report rescues, submit adoption applications, report lost/found pets, donate, chat, view notifications.
- **Rescue Team** — create rescue reports, accept and update rescue requests, add adoption animals, manage adoption applications.
- **Admin** — access analytics, manage users, verify rescue teams, moderate rescues, and view overall system data.

## Running the App Locally

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open the frontend URL shown by Vite, typically `http://localhost:5173`

## Deployment Tips

- Set backend environment variables for MongoDB and Cloudinary.
- Build the frontend with `npm run build` in the `frontend` folder.
- Ensure the backend `CLIENT_URL` matches the served frontend origin.
- Confirm Socket.IO uses the same host/port or correct `VITE_SOCKET_URL`.

## Useful Commands

- `cd backend && npm install`
- `cd backend && npm run dev`
- `cd frontend && npm install`
- `cd frontend && npm run dev`
- `cd frontend && npm run build`

## Summary

This project is a complete animal rescue network that offers reporting, adoption, lost/found, volunteer coordination, donation tracking, admin analytics, and real-time chat across both backend and frontend systems.
