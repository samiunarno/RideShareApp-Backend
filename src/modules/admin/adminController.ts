import { Request, Response } from 'express';
import User from '../../models/User';
import Driver from '../../models/Driver';
import Ride from '../../models/Ride';
import { AuthRequest } from '../../types/index';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    let query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, approvalStatus, search } = req.query;
    
    let query: any = {};
    
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    const drivers = await Driver.find(query)
      .populate('userId', 'name email phone isBlocked')
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    // Filter by search if provided
    let filteredDrivers = drivers;
    if (search) {
      filteredDrivers = drivers.filter(driver => 
        driver.userId && 
        (typeof driver.userId === 'object' && 'name' in driver.userId && 'email' in driver.userId) &&
        ((driver.userId as any).name?.toLowerCase().includes((search as string).toLowerCase()) ||
        (driver.userId as any).email?.toLowerCase().includes((search as string).toLowerCase()))
      );
    }

    const total = await Driver.countDocuments(query);

    res.json({
      success: true,
      data: {
        drivers: filteredDrivers,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
        },
      },
    });
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get drivers',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllRides = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('riderId', 'name email phone')
      .populate('driverId', 'name email phone')
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Ride.countDocuments(query);

    res.json({
      success: true,
      data: {
        rides,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / Number(limit)),
          total,
        },
      },
    });
  } catch (error) {
    console.error('Get all rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rides',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const approveDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!['approved', 'suspended', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status',
      });
    }

    const driver = await Driver.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true }
    ).populate('userId', 'name email');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found',
      });
    }

    res.json({
      success: true,
      message: `Driver ${approvalStatus} successfully`,
      data: driver,
    });
  } catch (error) {
    console.error('Approve driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update driver status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user,
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRiders = await User.countDocuments({ role: 'rider' });
    const totalDrivers = await Driver.countDocuments();
    const approvedDrivers = await Driver.countDocuments({ approvalStatus: 'approved' });
    const onlineDrivers = await Driver.countDocuments({ isOnline: true, approvalStatus: 'approved' });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const activeRides = await Ride.countDocuments({ 
      status: { $in: ['requested', 'accepted', 'picked_up', 'in_transit'] } 
    });

    // Calculate total revenue
    const revenueData = await Ride.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$fare' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          riders: totalRiders,
          drivers: totalDrivers,
        },
        drivers: {
          total: totalDrivers,
          approved: approvedDrivers,
          online: onlineDrivers,
        },
        rides: {
          total: totalRides,
          completed: completedRides,
          active: activeRides,
        },
        revenue: {
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};