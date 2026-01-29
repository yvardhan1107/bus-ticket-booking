import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routeAPI } from '../../services/api';
import { FaSearch, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal } from 'react-icons/md';

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
    return bus.images[0];  // Use stored image if available
  }
  return busTypeImages[bus?.busType] || '/bus-images/bus9.png';  // Fallback based on type
};

const Bus = () => {
  const location = useLocation();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [busTypeFilter, setBusTypeFilter] = useState('');


  // Get search results from navigation state or fetch all routes
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        if (location.state?.routes) {
          setRoutes(location.state.routes);
        } else {
          const data = await routeAPI.getAll();
          setRoutes(data);
        }
      } catch (err) {
        setError('Failed to load routes. Make sure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [location.state]);

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch =
      route.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.bus?.busName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBusType = !busTypeFilter || route.bus?.busType === busTypeFilter;

    return matchesSearch && matchesBusType;
  });

  if (loading) {
    return (
      <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] flex items-center justify-center min-h-[50vh]'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] space-y-8'>
      {/* Search Info Banner */}
      {location.state?.searchParams && (
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-200 dark:border-violet-800">
          <p className="text-violet-800 dark:text-violet-300 font-medium">
            Showing buses from <span className="font-bold">{location.state.searchParams.from}</span> to{' '}
            <span className="font-bold">{location.state.searchParams.to}</span> on{' '}
            <span className="font-bold">{formatDate(location.state.searchParams.date)}</span>
          </p>
        </div>
      )}

      {/* Search and Filter */}
      <div className='w-full grid grid-cols-1 md:grid-cols-6 gap-4 bg-neutral-200/60 dark:bg-neutral-900/40 rounded-md px-6 py-5 items-center'>
        <div className="flex items-center gap-x-2.5 col-span-1 md:col-span-3">
          <input
            type="text"
            placeholder="Search buses, routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900'
          />
          <button className='bg-violet-600 h-11 px-4 rounded-md text-base text-neutral-50 font-normal hover:bg-violet-700 transition-colors'>
            <FaSearch />
          </button>
        </div>
        <div className="col-span-1 md:col-span-1"></div>
        <div className="col-span-1 md:col-span-2">
          <select
            value={busTypeFilter}
            onChange={(e) => setBusTypeFilter(e.target.value)}
            className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
          >
            <option value="">All Bus Types</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Sleeper">Sleeper</option>
            <option value="Semi-Sleeper">Semi-Sleeper</option>
            <option value="Volvo">Volvo</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results Count */}
      <p className="text-neutral-600 dark:text-neutral-400">
        Found <span className="font-semibold text-violet-600">{filteredRoutes.length}</span> buses
      </p>

      {/* Bus Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">No buses found matching your criteria</p>
            <Link to="/" className="text-violet-600 hover:underline mt-2 inline-block">
              Try a different search
            </Link>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <Link
              key={route._id}
              to={`/bus/${route._id}`}
              state={{ route }}
              className='w-full bg-neutral-200/60 dark:bg-neutral-900/60 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300'
            >
              <img
                src={getImageForBus(route.bus)}
                alt={route.bus?.busName || 'Bus'}
                className='w-full aspect-video object-cover object-center rounded-lg'
              />
              <div className="px-2 py-4 space-y-3">
                {/* Bus Name and Type */}
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50">
                    {route.bus?.busName || 'Bus'}
                  </h1>
                  <span className="text-xs font-medium px-2 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-full">
                    {route.bus?.busType || 'AC'}
                  </span>
                </div>

                {/* Route Info */}
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <FaMapMarkerAlt className="text-violet-500" />
                  <span>{route.origin}</span>
                  <span>→</span>
                  <span>{route.destination}</span>
                </div>

                {/* Time and Duration */}
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <FaClock className="text-violet-500" />
                  <span>{formatDate(route.departureTime)}</span>
                  <span className="text-neutral-400">|</span>
                  <span>{formatTime(route.departureTime)}</span>
                  <span className="text-neutral-400">|</span>
                  <span>{route.duration}</span>
                </div>

                {/* Seats and Price */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-300 dark:border-neutral-700">
                  <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <MdAirlineSeatReclineNormal className="text-lg text-violet-500" />
                    <span>{route.availableSeats} seats left</span>
                  </div>
                  <p className="text-xl font-bold text-violet-600">
                    ₹{route.price}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Bus;
