import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Logo from "../../assets/logo.png"
import { LiaTimesSolid } from 'react-icons/lia';
import { FaBars, FaUser, FaSignOutAlt, FaCog, FaTicketAlt, FaChevronDown } from 'react-icons/fa';
import Theme from '../theme/Theme';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isAdmin = user?.role === 'admin';

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/bus", label: "Bus" },
        { href: "/services", label: "Services" },
    ]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = () => {
        setOpen(!open);
    }

    const handleClose = () => {
        setOpen(false);
        setDropdownOpen(false);
    }

    const handleLogout = () => {
        logout();
        navigate('/');
        handleClose();
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <div className='w-full h-[8ch] bg-neutral-100 dark:bg-neutral-900 flex items-center md:flex-row lg:px-28 md:px-16 sm:px-7 px-4 fixed top-0 z-50'>
            {/* Logo section */}
            <Link to={"/"} className='mr-16'>
                <img src={Logo} alt="logo" className="w-28 h-auto object-contain" />
            </Link>

            {/* Toggle button */}
            <button onClick={handleClick} className="flex-1 lg:hidden text-neutral-600 dark:text-neutral-300 ease-in-out duration-300 flex items-center justify-end">
                {
                    open ?
                        <LiaTimesSolid className='text-xl' />
                        :
                        <FaBars className='text-xl' />
                }
            </button>

            {/* Navigation links */}
            <div className={`${open ? 'flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative' : 'hidden'} flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2 md:items-center md:p-0 sm:p-4 p-4 justify-between md:bg-transparent bg-neutral-100 dark:bg-neutral-900 md:shadow-none shadow-md rounded-md`}>
                <ul className="list-none flex md:items-center items-start gap-x-5 gap-y-1 flex-wrap md:flex-row flex-col text-base text-neutral-600 dark:text-neutral-500 font-medium">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link
                                to={link.href}
                                onClick={handleClose}
                                className="hover:text-violet-600 ease-in-out duration-300"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex md:items-center items-start gap-x-4 gap-y-2 flex-wrap md:flex-row flex-col text-base font-medium text-neutral-800">
                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* User Button (Dropdown Trigger) */}
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
                            >
                                <FaUser />
                                <span>{user?.name}</span>
                                <FaChevronDown className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                                    {/* Admin Panel Link */}
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={handleClose}
                                            className="flex items-center gap-x-2 px-4 py-2 text-orange-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                                        >
                                            <FaCog />
                                            Admin Panel
                                        </Link>
                                    )}

                                    {/* My Bookings Link - only for regular users */}
                                    {!isAdmin && (
                                        <Link
                                            to="/bookings/my"
                                            onClick={handleClose}
                                            className="flex items-center gap-x-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                                        >
                                            <FaTicketAlt className="text-violet-500" />
                                            My Bookings
                                        </Link>
                                    )}

                                    {/* Profile Link */}
                                    <Link
                                        to="/profile"
                                        onClick={handleClose}
                                        className="flex items-center gap-x-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                                    >
                                        <FaUser className="text-violet-500" />
                                        My Profile
                                    </Link>

                                    {/* Divider */}
                                    <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-x-2 px-4 py-2 w-full text-left text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-3">
                            <Link
                                to="/login"
                                onClick={handleClose}
                                className="px-5 py-2 text-violet-600 hover:text-violet-700 font-medium transition-colors duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={handleClose}
                                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md transition-colors duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                    {/* Theme */}
                    <Theme />
                </div>
            </div>

        </div>
    )
}

export default Navbar