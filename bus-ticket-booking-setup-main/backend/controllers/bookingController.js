import Booking from '../models/Booking.js';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import { sendBookingConfirmation } from '../utils/emailService.js';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { route, seatNumbers, passengerDetails, travelDate } = req.body;

    // Get route to check available seats and price
    const routeData = await Route.findById(route);
    if (!routeData) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Check if seats are available
    const conflictingSeats = seatNumbers.filter(seat => routeData.bookedSeats.includes(seat));
    if (conflictingSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        conflictingSeats 
      });
    }

    // Calculate total amount
    const totalAmount = routeData.price * seatNumbers.length;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      route,
      seatNumbers,
      passengerDetails,
      totalAmount,
      travelDate,
      status: 'confirmed'
    });

    // Update route with booked seats
    routeData.bookedSeats.push(...seatNumbers);
    routeData.availableSeats -= seatNumbers.length;
    await routeData.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate({
        path: 'route',
        populate: { path: 'bus' }
      });

    // Send booking confirmation email
    if (populatedBooking.user?.email) {
      sendBookingConfirmation(populatedBooking, populatedBooking.user.email);
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'route',
        populate: { path: 'bus' }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'route',
        populate: { path: 'bus' }
      });

    if (booking) {
      // Check if booking belongs to user or user is admin
      if (booking.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Free up the seats
    const routeData = await Route.findById(booking.route);
    if (routeData) {
      routeData.bookedSeats = routeData.bookedSeats.filter(
        seat => !booking.seatNumbers.includes(seat)
      );
      routeData.availableSeats += booking.seatNumbers.length;
      await routeData.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .populate({
        path: 'route',
        populate: { path: 'bus' }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get dashboard statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments({
      isActive: true,
      departureTime: { $gte: new Date() }
    });

    const revenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalBookings,
      totalBuses,
      totalRoutes,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
