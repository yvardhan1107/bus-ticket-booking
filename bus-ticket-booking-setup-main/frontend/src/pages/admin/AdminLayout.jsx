import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBus, FaRoute, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
        { path: '/admin/buses', label: 'Bus Management', icon: <FaBus /> },
        { path: '/admin/routes', label: 'Route Management', icon: <FaRoute /> },
    ];

    return (
        <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 flex flex-col`}>
                <div className="h-16 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800">
                    <h1 className={`font-bold text-violet-600 text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
                    <span className={`font-bold text-violet-600 text-xl ${sidebarOpen && 'hidden'}`}>AP</span>
                </div>

                <div className="flex-1 py-6 space-y-2 px-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === item.path
                                ? 'bg-violet-600/10 text-violet-600'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-x-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-600 hover:text-violet-600">
                        <FaBars className="text-xl" />
                    </button>
                    <div className="flex items-center gap-x-4">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">Welcome, {user?.name}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
