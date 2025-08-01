import express from 'express';
import { getDriverProfile, updateOnlineStatus, getEarnings } from './driverController';
import { authenticate, authorize } from '../../middlewares/auth';

const router = express.Router();

router.get('/profile', authenticate, authorize('driver'), getDriverProfile);
router.patch('/online-status', authenticate, authorize('driver'), updateOnlineStatus);
router.get('/earnings', authenticate, authorize('driver'), getEarnings);

export default router;