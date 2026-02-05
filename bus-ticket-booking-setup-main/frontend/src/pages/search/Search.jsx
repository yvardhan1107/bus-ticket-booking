import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routeAPI } from '../../services/api';

const cities = [
  'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Delhi',
  'Hyderabad', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Goa'
];

const Search = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    if (!formData.from || !formData.to || !formData.date) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.from === formData.to) {
      setError('Origin and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await routeAPI.search({
        origin: formData.from,
        destination: formData.to,
        date: formData.date
      });

      // Navigate to bus listing with search results
      navigate('/bus', {
        state: {
          routes: results,
          searchParams: formData
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to search routes');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
      <div className="w-full bg-neutral-100 rounded-md dark:bg-neutral-900/40 p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-6 items-end">

          {/* From */}
          <div>
            <label htmlFor="from" className="block mb-2 font-semibold">
              From
            </label>
            <select
              name="from"
              id="from"
              value={formData.from}
              onChange={handleChange}
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 
              border border-neutral-200 dark:border-neutral-900 rounded-md 
              focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            >
              <option value="">Select Origin</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label htmlFor="to" className="block mb-2 font-semibold">
              To
            </label>
            <select
              name="to"
              id="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 
              border border-neutral-200 dark:border-neutral-900 rounded-md 
              focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            >
              <option value="">Select Destination</option>
              {cities.filter(city => city !== formData.from).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block mb-2 font-semibold">
              Travel Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 
              border border-neutral-200 dark:border-neutral-900 rounded-md 
              focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
          </div>

          {/* Passengers */}
          <div>
            <label htmlFor="passengers" className="block mb-2 font-semibold">
              Passengers
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              min="1"
              max="10"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 
              placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
              inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 
              border border-neutral-200 dark:border-neutral-900 rounded-md 
              focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
          </div>

          {/* Button */}
          <div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="w-full px-4 h-12 bg-violet-600 hover:bg-violet-700 
              text-neutral-50 text-base font-normal rounded-md 
              transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
