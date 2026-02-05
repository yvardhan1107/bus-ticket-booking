import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { route, selectedSeats, totalAmount } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for main contact info
    const [contactInfo, setContactInfo] = useState({
        fullname: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        altphone: ''
    });

    // State for passenger details per seat
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        if (!route || !selectedSeats) {
            navigate('/');
            return;
        }

        // Initialize passenger forms
        const initialPassengers = selectedSeats.map(seat => ({
            seatNumber: seat,
            name: '',
            age: '',
            gender: 'male'
        }));
        setPassengers(initialPassengers);
    }, [route, selectedSeats, navigate]);

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            setError('Please login to complete your booking');
            return;
        }

        // Validate passenger details
        const invalidPassenger = passengers.find(p => !p.name || !p.age);
        if (invalidPassenger) {
            setError('Please fill all passenger details');
            return;
        }

        setLoading(true);

        try {
            const bookingData = {
                route: route._id,
                seatNumbers: selectedSeats,
                passengerDetails: passengers.map(p => ({
                    name: p.name,
                    age: parseInt(p.age),
                    gender: p.gender
                })),
                travelDate: route.departureTime
            };

            await bookingAPI.create(bookingData);
            alert('Booking confirmed successfully!');
            navigate('/bookings/my');
        } catch (err) {
            setError(err.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!route || !selectedSeats) return null;

    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] space-y-10'>
            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                <div className="col-span-1 lg:col-span-3 space-y-7 pr-0 lg:pr-20">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className='text-xl text-neutral-800 dark:text-neutral-100 font-medium'>
                                Contact Information
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block mb-2 font-semibold'>Full Name</label>
                                    <input
                                        type="text"
                                        name='fullname'
                                        value={contactInfo.fullname}
                                        onChange={handleContactChange}
                                        required
                                        className='w-full p-3 border rounded-md bg-neutral-200/60 dark:bg-neutral-900/60 dark:border-neutral-800'
                                    />
                                </div>
                                <div>
                                    <label className='block mb-2 font-semibold'>Email</label>
                                    <input
                                        type="email"
                                        name='email'
                                        value={contactInfo.email}
                                        onChange={handleContactChange}
                                        required
                                        className='w-full p-3 border rounded-md bg-neutral-200/60 dark:bg-neutral-900/60 dark:border-neutral-800'
                                    />
                                </div>
                                <div>
                                    <label className='block mb-2 font-semibold'>Phone</label>
                                    <input
                                        type="tel"
                                        name='phone'
                                        value={contactInfo.phone}
                                        onChange={handleContactChange}
                                        required
                                        className='w-full p-3 border rounded-md bg-neutral-200/60 dark:bg-neutral-900/60 dark:border-neutral-800'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="space-y-6">
                            <h2 className='text-xl text-neutral-800 dark:text-neutral-100 font-medium border-t pt-6'>
                                Passenger Details
                            </h2>
                            {passengers.map((passenger, index) => (
                                <div key={index} className="bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-4">
                                    <h3 className="font-semibold text-violet-600">
                                        Passenger {index + 1} (Seat {passenger.seatNumber})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={passenger.name}
                                                onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                required
                                                className='w-full p-3 border rounded-md bg-white dark:bg-neutral-900 dark:border-neutral-800'
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={passenger.age}
                                                onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                required
                                                min="1"
                                                max="120"
                                                className='w-full p-3 border rounded-md bg-white dark:bg-neutral-900 dark:border-neutral-800'
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={passenger.gender}
                                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                className='w-full p-3 border rounded-md bg-white dark:bg-neutral-900 dark:border-neutral-800'
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isAuthenticated}
                            className="w-full px-8 h-12 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                        </button>
                    </form>
                </div>

                {/* Booking Summary - Right Side */}
                <div className="col-span-1 lg:col-span-2 space-y-8 sticky top-24">
                    <div className="bg-neutral-200/50 dark:bg-neutral-900/70 rounded-md py-5 px-7">
                        <h2 className='text-xl text-center text-neutral-800 dark:text-neutral-100 font-medium border-b-2 border-neutral-200 dark:border-neutral-800/40 pb-3 mb-4'>
                            Booking Summary
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{route.bus.busName}</h3>
                                <p className="text-sm text-neutral-500">{route.bus.busType}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-left">
                                        <p className="font-medium text-lg">{new Date(route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-neutral-500">{route.origin}</p>
                                    </div>
                                    <div className="flex-1 px-4 border-b border-dashed border-neutral-400"></div>
                                    <div className="text-right">
                                        <p className="font-medium text-lg">{new Date(route.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-neutral-500">{route.destination}</p>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-neutral-400">
                                    {new Date(route.departureTime).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="border-t border-dashed border-neutral-400 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Selected Seats</span>
                                    <span className="font-medium">{selectedSeats.join(', ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price per seat</span>
                                    <span>₹{route.price}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-neutral-300 font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span className="text-violet-600">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
