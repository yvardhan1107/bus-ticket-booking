import express from 'express';
import { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, getDashboardStats } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes - Must be before /:id
router.get('/stats', protect, admin, getDashboardStats);
router.get('/', protect, admin, getAllBookings);

// Protected routes (require login)
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
