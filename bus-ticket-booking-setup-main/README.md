# Bus Ticket Booking - Full Stack Implementation

## ✅ What Was Built

### Backend (Node.js + Express + MongoDB)
Full CRUD API for Busses, Routes, Booking, and Users.

### Frontend Updates

| Page/Component | Status | Features |
|----------------|--------|----------|
| **Bus Listing** | ✅ | Dynamic API data, search filtering |
| **Bus Details** | ✅ | Dynamic route info, fetches by ID |
| **Seat Map** | ✅ | Interactive grid, disables booked seats, tracks price |
| **Checkout** | ✅ | Passenger details form per seat, booking submission |
| **My Bookings** | ✅ | List user bookings, cancel booking option |
| **Admin Panel** | ✅ | Dashboard, Bus CRUD, Route Scheduling |

---

## 👩‍💻 Admin Dashboard Guide

To access the admin panel, you must login with an **admin account**.
**URL:** `/admin/dashboard`
**Test Admin:** `admin@busbook.com` / `admin123`

### 1. Manage Buses (`/admin/buses`)
- **View:** See a list of all buses in the fleet.
- **Add:** Click "Add Bus" to register a new vehicle (Name, Number, Type, Seats, Amenities).
- **Edit/Delete:** Update details or remove a bus from service.

### 2. Manage Routes (`/admin/routes`)
- **Schedule:** Assign a bus to a route (Origin -> Destination).
- **Date/Time:** Set departure and duration.
- **Price:** Set ticket price per seat.
- **Auto-Seats:** Available seats are automatically pulled from the selected bus capacity.

---

## 🚀 How to Run

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
# In project root
npm run dev
```

---

## 📡 API Endpoints Used

- `GET /api/buses` (Public) - List active buses
- `POST /api/buses` (Admin) - Create bus
- `GET /api/routes` (Public) - List active routes
- `POST /api/routes` (Admin) - Create route
- `GET /api/routes/:id` - Fetch route details + booked seats
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my` - Fetch user history

---

## Credentials
- **Admin:** `admin@busbook.com` / `admin123`
- **User:** `john@example.com` / `user123`
