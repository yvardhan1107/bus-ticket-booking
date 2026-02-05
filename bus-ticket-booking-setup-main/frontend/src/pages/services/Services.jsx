import React from 'react';

const Services = () => {
  return (
    <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch]'>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          Our Services
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Online Booking
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Book your bus tickets online with our user-friendly platform. Secure payments and instant confirmations.
            </p>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Multiple Routes
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Access to a wide network of bus routes covering major cities and destinations across the country.
            </p>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Seat Selection
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Choose your preferred seat from our interactive seat map for a comfortable journey.
            </p>
          </div>
          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              24/7 Support
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Round-the-clock customer support to assist you with any queries or issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

