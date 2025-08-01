import express from 'express';
import {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  approveDriver,
  blockUser,
  getDashboardStats,
} from './adminController';
import { authenticate, authorize } from '../../middlewares/auth';

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/drivers', getAllDrivers);
router.get('/rides', getAllRides);
router.patch('/drivers/:id/approve', approveDriver);
router.patch('/users/:id/block', blockUser);

export default router;