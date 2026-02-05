import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBus, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';

const MyBookings = () => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Wait for auth to load, then check if authenticated
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!authLoading && isAuthenticated) {
            fetchBookings();
        }
    }, [authLoading, isAuthenticated, navigate]);

    const fetchBookings = async () => {
        try {
            const data = await bookingAPI.getMyBookings();
            setBookings(data);
            setError('');
        } catch (err) {
            if (err.message?.includes('Not authorized')) {
                setError('Please login to view your bookings');
            } else {
                setError('Failed to load your bookings');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingAPI.cancel(id);
            // Refresh bookings
            await fetchBookings();
            alert('Booking cancelled successfully');
        } catch (err) {
            alert(err.message || 'Failed to cancel booking');
        }
    };

    // Show loading while checking auth
    if (authLoading || loading) return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] flex justify-center'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
    );

    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] min-h-[60vh]'>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">
                My Bookings
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                    {error}
                    <Link to="/login" className="ml-2 underline">Login here</Link>
                </div>
            )}

            {!error && bookings.length === 0 ? (
                <div className="text-center py-12 bg-neutral-100 dark:bg-neutral-900/40 rounded-lg">
                    <FaTicketAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-neutral-600 dark:text-neutral-400">
                        No bookings found
                    </h3>
                    <p className="text-neutral-500 mt-2 mb-6">
                        Looks like you haven't booked any trips yet.
                    </p>
                    <Link to="/bus" className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700">
                        Book a Trip
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-violet-600 flex items-center gap-2">
                                            <FaBus />
                                            {booking.route?.bus?.busName || 'Bus Name Unavailable'}
                                        </h3>
                                        <div className="text-sm text-neutral-500 mt-1">
                                            Booking ID: <span className="font-mono">{booking._id.slice(-6).toUpperCase()}</span>
                                            <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {booking.status?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                            ₹{booking.totalAmount}
                                        </div>
                                        <div className="text-sm text-neutral-500">
                                            {booking.seatNumbers?.length || 0} Seat(s)
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-lg">
                                                    {booking.route?.departureTime ? new Date(booking.route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                </span>
                                                <span className="text-neutral-500">{booking.route?.origin || 'Origin'}</span>
                                            </div>
                                            <div className="flex-1 px-4 flex flex-col items-center">
                                                <span className="text-xs text-neutral-400 mb-1">{booking.route?.duration || ''}</span>
                                                <div className="w-full border-t border-dashed border-neutral-300"></div>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="font-medium text-lg">
                                                    {booking.route?.arrivalTime ? new Date(booking.route.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                </span>
                                                <span className="text-neutral-500">{booking.route?.destination || 'Destination'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400 pt-2">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-violet-500" />
                                                <span>{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Date not set'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaTicketAlt className="text-violet-500" />
                                                <span>Seats: {booking.seatNumbers?.join(', ') || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-end">
                                        {booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors border border-red-200 dark:border-red-800"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
