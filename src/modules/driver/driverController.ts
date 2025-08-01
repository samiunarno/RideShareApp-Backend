import { Response } from 'express';
import Driver from '../../models/Driver';
import { AuthRequest } from '../../types/index';

export const getDriverProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const driver = await Driver.findOne({ userId }).populate('userId', 'name email phone');
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    res.json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateOnlineStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { isOnline } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { userId },
      { isOnline },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    if (driver.approvalStatus !== 'approved') {
      if (isOnline) {
        return res.status(403).json({
          success: false,
          message: 'Driver must be approved to go online',
        });
      }
    }

    res.json({
      success: true,
      message: `Driver is now ${isOnline ? 'online' : 'offline'}`,
      data: driver,
    });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update online status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getEarnings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const driver = await Driver.findOne({ userId });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found',
      });
    }

    res.json({
      success: true,
      data: {
        totalEarnings: driver.earnings,
        totalRides: driver.totalRides,
        rating: driver.rating,
      },
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get earnings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};