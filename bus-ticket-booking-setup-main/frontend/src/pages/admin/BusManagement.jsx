import React, { useState, useEffect } from 'react';
import { busAPI } from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Mapping of bus type to image
const busTypeImages = {
    'AC': '/bus-images/bus9.png',
    'Non-AC': '/bus-images/bus8.png',
    'Sleeper': '/bus-images/bus6.png',
    'Volvo': '/bus-images/bus1.png'
};

const BusManagement = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [formData, setFormData] = useState({
        busName: '',
        busNumber: '',
        busType: 'AC',
        totalSeats: 40,
        operator: '',
        amenities: ''
    });

    const fetchBuses = async () => {
        try {
            const data = await busAPI.getAll();
            setBuses(data);
        } catch (error) {
            alert('Failed to fetch buses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    // Get image path based on bus type
    const getImageForType = (type) => {
        return busTypeImages[type] || busTypeImages['AC'];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create JSON data with auto-selected image
            const data = {
                busName: formData.busName,
                busNumber: formData.busNumber,
                busType: formData.busType,
                totalSeats: formData.totalSeats,
                operator: formData.operator,
                amenities: formData.amenities.split(',').map(item => item.trim()),
                images: [getImageForType(formData.busType)]
            };

            if (editingBus) {
                await busAPI.update(editingBus._id, data);
            } else {
                await busAPI.create(data);
            }

            setIsModalOpen(false);
            setEditingBus(null);
            setFormData({
                busName: '',
                busNumber: '',
                busType: 'AC',
                totalSeats: 40,
                operator: '',
                amenities: ''
            });
            fetchBuses();
        } catch (error) {
            console.error(error);
            alert(error.message || 'Operation failed');
        }
    };

    const handleEdit = (bus) => {
        setEditingBus(bus);
        setFormData({
            busName: bus.busName,
            busNumber: bus.busNumber,
            busType: bus.busType,
            totalSeats: bus.totalSeats,
            operator: bus.operator,
            amenities: bus.amenities.join(', ')
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await busAPI.delete(id);
                fetchBuses();
            } catch (error) {
                alert('Failed to delete bus');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Bus Management</h1>
                <button
                    onClick={() => {
                        setEditingBus(null);
                        setFormData({
                            busName: '',
                            busNumber: '',
                            busType: 'AC',
                            totalSeats: 40,
                            operator: '',
                            amenities: ''
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
                >
                    <FaPlus /> Add Bus
                </button>
            </div>

            {/* Bus List */}
            <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                        <tr>
                            <th className="p-4 font-medium text-neutral-500">Image</th>
                            <th className="p-4 font-medium text-neutral-500">Bus Name</th>
                            <th className="p-4 font-medium text-neutral-500">Number</th>
                            <th className="p-4 font-medium text-neutral-500">Type</th>
                            <th className="p-4 font-medium text-neutral-500">Seats</th>
                            <th className="p-4 font-medium text-neutral-500">Operator</th>
                            <th className="p-4 font-medium text-neutral-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buses.map((bus) => (
                            <tr key={bus._id} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                                <td className="p-4">
                                    <img
                                        src={bus.images?.[0] || getImageForType(bus.busType)}
                                        alt={bus.busName}
                                        className="w-16 h-10 object-cover rounded"
                                    />
                                </td>
                                <td className="p-4 font-medium">{bus.busName}</td>
                                <td className="p-4 text-neutral-600">{bus.busNumber}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-violet-100 text-violet-600 rounded text-sm">{bus.busType}</span>
                                </td>
                                <td className="p-4">{bus.totalSeats}</td>
                                <td className="p-4">{bus.operator}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(bus)}
                                        className="text-blue-600 hover:text-blue-800 p-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bus._id)}
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
                    <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-lg p-6 space-y-4">
                        <h2 className="text-xl font-bold">{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bus Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.busName}
                                        onChange={e => setFormData({ ...formData, busName: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bus Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.busNumber}
                                        onChange={e => setFormData({ ...formData, busNumber: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                        value={formData.busType}
                                        onChange={e => setFormData({ ...formData, busType: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    >
                                        <option value="AC">AC</option>
                                        <option value="Non-AC">Non-AC</option>
                                        <option value="Sleeper">Sleeper</option>
                                        <option value="Volvo">Volvo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Seats</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.totalSeats}
                                        onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                        className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Operator</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.operator}
                                    onChange={e => setFormData({ ...formData, operator: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
                                <textarea
                                    value={formData.amenities}
                                    onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                                    className="w-full p-2 border rounded dark:bg-neutral-800 dark:border-neutral-700"
                                    placeholder="WiFi, AC, Water Bottle..."
                                ></textarea>
                            </div>


                            <div className="flex gap-4 pt-2">
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
                                    {editingBus ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusManagement;
