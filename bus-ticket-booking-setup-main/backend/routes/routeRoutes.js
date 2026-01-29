import express from 'express';
import { getRoutes, searchRoutes, getRouteById, createRoute, updateRoute, deleteRoute } from '../controllers/routeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRoutes);
router.get('/search', searchRoutes);
router.get('/:id', getRouteById);

// Admin routes
router.post('/', protect, admin, createRoute);
router.put('/:id', protect, admin, updateRoute);
router.delete('/:id', protect, admin, deleteRoute);

export default router;
