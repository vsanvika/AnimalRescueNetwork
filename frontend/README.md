# Frontend - Animal Rescue Network

This frontend is a React application built with Vite and Tailwind CSS for the Animal Rescue Network.

## Overview

The frontend provides the user interface for:

- Authentication (login and registration)
- Rescue reporting
- Adoption listings and applications
- Lost & Found reporting
- Volunteer registration
- Donation submission
- Profile management
- Real-time chat
- Admin features and analytics
- QR generation and scanning

## Folder Structure

```text
frontend/
├── api/          # Axios client setup, auth interceptor, error handling
├── assets/       # static assets and images
├── components/   # reusable UI components
├── hooks/        # custom hooks such as socket handling
├── pages/        # app views, forms, dashboards, and feature pages
├── store/        # Zustand stores for auth, chat, notifications
├── App.jsx       # route definitions and layout
├── index.css     # global styles
├── main.jsx      # React app bootstrapping
├── package.json  # frontend dependencies and scripts
└── vite.config.js# Vite configuration
```

## Environment Variables

Create a `.env` file in `frontend/` with:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

```bash
cd frontend
npm install
```

## Run Locally

```bash
npm run dev
```

The frontend is served by Vite, typically at `http://localhost:5173`.

## Frontend Behavior

- Uses Axios with an auth token interceptor to include JWT in protected API requests.
- Automatically redirects to `/login` on 401 responses.
- Supports real-time Socket.IO chat in `src/components/ChatWindow.jsx`.
- Uses Tailwind utility classes for consistent styling.
- Contains form validation with required fields, select inputs, and file uploads.

## Core Pages

- `Home.jsx` — landing page with overview and navigation
- `Dashboard.jsx` — authenticated user dashboard
- `Login.jsx` / `Register.jsx` — auth forms
- `AdoptionList.jsx` — adoption animal listing and filters
- `AdoptionDetail.jsx` — adoption request form and details
- `ReportRescue.jsx` — emergency rescue report form
- `LostFound.jsx` — lost and found report form and listing
- `Volunteers.jsx` — volunteer registration and profile view
- `Donate.jsx` — donation form and history
- `Profile.jsx` — profile edit and avatar upload
- `AdminPanel.jsx` — admin analytics and management tools
- `Chat.jsx` — real-time chat interface
- `GenerateQR.jsx` — generate QR codes for animals

## Useful Scripts

- `npm run dev` — start development server
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — lint source files

## Notes

- The app is designed to work with the backend API at `VITE_API_URL`.
- `src/api/axios.js` handles JWT storage in localStorage and adds authorization headers.
- Form submission across the app uses HTML inputs, `required` fields, and client-side validation.
- Real-time socket communications happen over `VITE_SOCKET_URL`.

## Deployment Tips

- Set `VITE_API_URL` to your production backend API endpoint.
- Build with `npm run build` and deploy the generated static files.
- Ensure CORS is configured on the backend for the deployed frontend origin.
