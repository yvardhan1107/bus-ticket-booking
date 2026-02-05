import React from 'react';

const About = () => {
  return (
    <div className='w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch]'>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          About Us
        </h1>
        <div className="space-y-6 text-neutral-700 dark:text-neutral-300">
          <p className="text-lg leading-relaxed">
            Welcome to our bus ticket booking platform. We provide reliable and convenient bus transportation services across the country.
          </p>
          <p className="text-lg leading-relaxed">
            Our mission is to make travel accessible, comfortable, and affordable for everyone. With a wide network of bus operators and routes, we ensure you reach your destination safely and on time.
          </p>
          <p className="text-lg leading-relaxed">
            Whether you're traveling for business or leisure, we have the perfect bus option for your journey. Book your tickets with ease and enjoy a comfortable ride.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

