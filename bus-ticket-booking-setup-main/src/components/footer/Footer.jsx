import React from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import Logo from "../../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full lg:px-28 md:px-16 sm:px-7 px-4 py-8 bg-neutral-200/60 dark:bg-neutral-900/70">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="space-y-5">
          <Link to="/" className='text-xl text-neutral-800 dark:text-neutral-200 font-bold'>
            <img src={Logo} alt="logo" className="w-44 h-auto object-contain" />
          </Link>
          <p className="text-neutral-600 dark:text-neutral-500 text-base font-normal">
            Book your bus tickets easily and travel comfortably. We offer a wide range of bus services across multiple routes with secure booking and 24/7 support.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-5">
          <h1 className="text-lg font-medium">Quick Links</h1>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-500 text-base font-normal">
            <li>
              <Link to="/" className='hover:text-violet-600 ease-in-out duration-300'>Home</Link>
            </li>
            <li>
              <Link to="/bus" className='hover:text-violet-600 ease-in-out duration-300'>Browse Buses</Link>
            </li>
            <li>
              <Link to="/about" className='hover:text-violet-600 ease-in-out duration-300'>About Us</Link>
            </li>
            <li>
              <Link to="/services" className='hover:text-violet-600 ease-in-out duration-300'>Our Services</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-5">
          <h1 className="text-lg font-medium">Support</h1>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-500 text-base font-normal">
            <li>
              <Link to="/bookings/my" className='hover:text-violet-600 ease-in-out duration-300'>My Bookings</Link>
            </li>
            <li>
              <Link to="/profile" className='hover:text-violet-600 ease-in-out duration-300'>My Profile</Link>
            </li>
            <li>
              <Link to="/login" className='hover:text-violet-600 ease-in-out duration-300'>Login / Register</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-5">
          <h1 className="text-lg font-medium">Get In Touch</h1>
          <div className="space-y-4">
            <div className="flex gap-x-3 items-start">
              <FaMapMarkerAlt className='text-lg text-violet-500 mt-1' />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                123 Main Street, Mumbai, India 400001
              </p>
            </div>
            <div className="flex gap-x-3 items-start">
              <FaPhone className='text-lg text-violet-500 mt-1' />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                +91 1234 567 890
              </p>
            </div>
            <div className="flex gap-x-3 items-start">
              <FaEnvelope className='text-lg text-violet-500 mt-1' />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                support@busticket.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-neutral-300 dark:border-neutral-800">
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-600">
          © {currentYear} BusTicket Booking. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer