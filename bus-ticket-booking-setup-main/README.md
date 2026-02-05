# Bus Ticket Booking System 🚌

A modern, full-stack bus ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js). This system allows users to search for buses, view seat layouts, book tickets, and manage their bookings. It also includes a comprehensive Admin Dashboard for managing buses, routes, and schedules.

## 🚀 Features

### User Features
- **Search Buses**: Filter by source, destination, and date.
- **Seat Selection**: Interactive seat map with real-time availability.
- **Booking Management**: Book tickets and view booking history.
- **User Authentication**: Secure login and registration.
- **Responsive Design**: optimized for desktop and mobile devices.

### Admin Features
- **Dashboard**: Overview of system statistics.
- **Bus Management**: Add, update, and remove buses (including amenities, capacity, type).
- **Route Management**: Schedule routes, set prices, and assign buses.
- **Protected Routes**: Secure admin-only area.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, React Router DOM.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens).

## 📂 Project Structure

```
bus-ticket-booking-setup-main/
├── backend/            # Express API Server
│   ├── config/        # Database configuration
│   ├── models/        # Mongoose models (Bus, User, Route, Booking)
│   ├── routes/        # API routes
│   └── server.js      # Entry point
├── src/               # React Frontend
│   ├── components/    # Reusable components (Navbar, Footer, etc.)
│   ├── context/       # Context API (AuthContext)
│   ├── pages/         # Page components (Home, Bus, Admin, etc.)
│   └── App.jsx        # Main application component
└── ...
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local or Atlas connection string)

### 1. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other variables if needed
```

Start the backend server:

```bash
npm run dev
```
*The server will run on `http://localhost:5000`*

### 2. Frontend Setup
Navigate to the root directory (where `vite.config.js` is located) and install dependencies:

```bash
# Return to root if inside backend
cd .. 
npm install
```

Start the frontend development server:

```bash
npm run dev
```
*The application will run on `http://localhost:5173` (or similar)*

## 📡 API Endpoints

### Public
- `GET /api/buses`: Get all buses
- `GET /api/routes`: Get all routes
- `GET /api/routes/:id`: Get specific route details

### Authenticated User
- `POST /api/bookings`: Create a booking
- `GET /api/bookings/my`: Get user's booking history

### Admin
- `POST /api/buses`: Add a new bus
- `PUT /api/buses/:id`: Update bus details
- `DELETE /api/buses/:id`: Delete a bus
- `POST /api/routes`: Create a new route schedule

## 👥 Credentials (Default/Test)

**Admin Account:**
- Email: `admin@busbook.com`
- Password: `admin123`

**User Account:**
- Register a new account or use `john@example.com` / `user123`

## 📄 License
This project is licensed under the ISC License.
