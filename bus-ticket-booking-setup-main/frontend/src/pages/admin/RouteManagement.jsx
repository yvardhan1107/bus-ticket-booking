import React, { useState, useEffect } from 'react';
import { busAPI, routeAPI } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        bus: '',
        origin: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        duration: '',
        price: '',
        availableSeats: ''
    });

    const fetchData = async () => {
        try {
            const [routesData, busesData] = await Promise.all([
                routeAPI.getAll(),
                busAPI.getAll()
            ]);
            setRoutes(routesData);
            setBuses(busesData);
        } catch (error) {
            alert('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time
            const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
            const arrivalDateTime = new Date(departureDateTime.getTime() + parseFloat(formData.duration) * 60 * 60 * 1000);

            const data = {
                bus: formData.bus,
                origin: formData.origin,
                destination: formData.destination,
                departureTime: departureDateTime,
                arrivalTime: arrivalDateTime,
                price: parseFloat(formData.price),
                availableSeats: parseInt(formData.availableSeats)
            };

            if (editingRoute) {
                await routeAPI.update(editingRoute._id, data);
            } else {
                await routeAPI.create(data);
            }

            setIsModalOpen(false);
            setEditingRoute(null);
            resetForm();
            fetchData();
        } catch (error) {
            alert(error.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setFormData({
            bus: '',
            origin: '',
            destination: '',
            departureDate: '',
            departureTime: '',
            duration: '',
            price: '',
            availableSeats: ''
        });
    };

    const handleEdit = (route) => {
        const dep = new Date(route.departureTime);
        const arr = new Date(route.arrivalTime);
        const durationHours = (arr - dep) / (1000 * 60 * 60);

        setEditingRoute(route);
        setFormData({
            bus: route.bus._id || route.bus,
            origin: route.origin,
            destination: route.destination,
            departureDate: dep.toISOString().split('T')[0],
            departureTime: dep.toTimeString().slice(0, 5),
            duration: durationHours,
            price: route.price,
            availableSeats: route.availableSeats
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await routeAPI.delete(id);
                fetchData();
            } catch (error) {
                alert('Failed to delete route');
            }
        }
    };

    // Auto-set available seats when bus changes
    const handleBusChange = (e) => {
        const busId = e.target.value;
        const selectedBus = buses.find(b => b._id === busId);
        setFormData(prev => ({
            ...prev,
            bus: busId,
            availableSeats: selectedBus ? selectedBus.totalSeats : ''
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Route Management</h1>
                <button
                    onClick={() => {
                        setEditingRoute(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
                >
                    <FaPlus /> Add Route
                </button>
            </div>

            <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                            <th className="p-4 font-medium text-neutral-500">Bus</th>
                            <th className="p-4 font-medium text-neutral-500">Route</th>
                            <th className="p-4 font-medium text-neutral-500">Departure</th>
                            <th className="p-4 font-medium text-neutral-500">Price</th>
                            <th className="p-4 font-medium text-neutral-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route) => (
                            <tr key={route._id} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                <td className="p-4 font-medium">{route.bus?.busName || 'Unknown Bus'}</td>
                                <td className="p-4">{route.origin} → {route.destination}</td>
                                <td className="p-4">
                                    {new Date(route.departureTime).toLocaleDateString()} {new Date(route.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4">₹{route.price}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(route)}
                                        className="text-blue-600 hover:text-blue-800 p-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(route._id)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold">{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Bus</label>
                                <select
                                    required
                                    value={formData.bus}
                                    onChange={handleBusChange}
                                    className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                >
                                    <option value="">Select a Bus</option>
                                    {buses.map(bus => (
                                        <option key={bus._id} value={bus._id}>
                                            {bus.busName} ({bus.busNumber}) - {bus.totalSeats} Seats
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Origin</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.origin}
                                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Destination</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.destination}
                                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.departureDate}
                                        onChange={e => setFormData({ ...formData, departureDate: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.departureTime}
                                        onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (Hours)</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.5"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Available Seats</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.availableSeats}
                                        onChange={e => setFormData({ ...formData, availableSeats: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                                >
                                    {editingRoute ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteManagement;
