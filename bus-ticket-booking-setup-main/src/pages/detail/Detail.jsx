import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routeAPI } from '../../services/api';
import { FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import BusSeatLayout from '../../components/seat/Seat';


// Bus type to image mapping
const busTypeImages = {
    'AC': '/bus-images/bus9.png',
    'Non-AC': '/bus-images/bus8.png',
    'Sleeper': '/bus-images/bus6.png',
    'Volvo': '/bus-images/bus1.png'
};

// Get image based on bus type or use stored image
const getImageForBus = (bus) => {
    if (bus?.images && bus.images.length > 0) {
        return bus.images[0];
    }
    return busTypeImages[bus?.busType] || '/bus-images/bus9.png';
};

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const data = await routeAPI.getById(id);
                setRoute(data);
            } catch (err) {
                setError('Failed to load bus details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoute();
        }
    }, [id]);

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        navigate(`/bus/${id}/checkout`, {
            state: {
                route,
                selectedSeats,
                totalAmount: selectedSeats.length * route.price
            }
        });
    };

    if (loading) return <div className="text-center mt-[15ch]">Loading...</div>;
    if (error) return <div className="text-center mt-[15ch] text-red-500">{error}</div>;
    if (!route) return <div className="text-center mt-[15ch]">Bus not found</div>;

    return (
        <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[10ch]'>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="col-span-1 space-y-8">
                    <img src={getImageForBus(route.bus)} alt="detail img" className='w-full aspect-[3/2] rounded-md object-contain' />
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                            {route.bus.busName}
                            <span className="text-base font-normal text-neutral-400 dark:text-neutral-500 ml-3">
                                ({route.bus.busNumber})
                            </span>
                        </h1>
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-x-1 text-sm text-yellow-500 dark:text-yellow-600">
                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <p className='text-neutral-900 dark:text-neutral-200 text-sm font-normal'>
                                (4.5)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-violet-500" />
                                <span>From: {route.origin}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-violet-500" />
                                <span>To: {route.destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-violet-500" />
                                <span>Depart: {new Date(route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-violet-500" />
                                <span>Arrive: {new Date(route.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <p className='text-neutral-900 dark:text-neutral-200 text-sm font-normal'>
                            {route.bus.amenities.join(', ')}
                        </p>
                    </div>
                </div>

                <div className='col-span-1 space-y-10'>
                    {/* Seat Selection */}
                    <BusSeatLayout
                        price={route.price}
                        bookedSeats={route.bookedSeats}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                    />

                    {/* Checkout Btn */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleCheckout}
                            disabled={selectedSeats.length === 0}
                            className="w-fit bg-violet-600 text-neutral-50 font-medium text-base px-6 py-3 rounded-md hover:bg-violet-700 ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Detail;