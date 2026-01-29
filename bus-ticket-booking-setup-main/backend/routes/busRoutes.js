import express from 'express';
import { getBuses, getBusById, createBus, updateBus, deleteBus } from '../controllers/busController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBuses);
router.get('/:id', getBusById);

// Admin routes
router.post('/', protect, admin, createBus);
router.put('/:id', protect, admin, updateBus);
router.delete('/:id', protect, admin, deleteBus);

export default router;
