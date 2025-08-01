import express from 'express';
import {
  requestRide,
  getRideHistory,
  cancelRide,
  getAvailableRides,
  updateRideStatus,
} from './rideController';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateRequest, rideRequestSchema, rideStatusSchema } from '../../middlewares/validation';

const router = express.Router();

// Rider routes
router.post('/request', authenticate, authorize('rider'), validateRequest(rideRequestSchema), requestRide);
router.get('/me', authenticate, getRideHistory);
router.patch('/:id/cancel', authenticate, authorize('rider'), cancelRide);

// Driver routes
router.get('/available', authenticate, authorize('driver'), getAvailableRides);
router.patch('/:id/status', authenticate, authorize('driver'), validateRequest(rideStatusSchema), updateRideStatus);

export default router;