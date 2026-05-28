# Animal Rescue Network 🐾

A full-stack MERN application connecting citizens, rescue teams, and NGOs to save animal lives.

## Project Structure

```
AnimalRescueNetwork/
├── backend/   → Node.js + Express + MongoDB API
└── frontend/  → React + Vite + Tailwind CSS
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
# Edit .env with your MongoDB Atlas URI and Cloudinary keys
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Modules

| Module | Features |
|--------|---------|
| Authentication | Register, Login, JWT, Role-based access |
| Rescue Reports | Report, Accept, Status tracking, Map |
| Adoption | List animals, Apply, Approve/Reject |
| Lost & Found | Report lost/found pets, Contact |
| Real-Time Chat | Socket.IO, Typing, Seen status |
| Volunteers | Register, Assign, Track rescues |
| Donations | Donate, History, Impact tracking |
| Admin Dashboard | Analytics, User management, Verify teams |
| Notifications | Real-time, In-app, Mark as read |

## Roles

- **User** — Report animals, adopt, donate, chat
- **Rescue Team** — Accept reports, add animals, manage rescues
- **Admin** — Full control, analytics, user management

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v6, Zustand, Socket.IO Client, Leaflet.js
- **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT, Socket.IO, Multer, Cloudinary
