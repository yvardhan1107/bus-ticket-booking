import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import { FaBus, FaRoute, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-neutral-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBuses: 0,
        totalRoutes: 0,
        totalBookings: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await bookingAPI.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Dashboard Overview</h1>
                <Link to="/" className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                    Go to Home
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Buses"
                    value={stats.totalBuses}
                    icon={<FaBus />}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                />
                <StatCard
                    title="Active Routes"
                    value={stats.totalRoutes}
                    icon={<FaRoute />}
                    color="bg-green-100 text-green-600 dark:bg-green-900/20"
                />

                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon={<FaTicketAlt />}
                    color="bg-violet-100 text-violet-600 dark:bg-violet-900/20"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={<FaMoneyBillWave />}
                    color="bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                />
            </div>


        </div>
    );
};

export default AdminDashboard;
