"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.blockUser = exports.approveDriver = exports.getAllRides = exports.getAllDrivers = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Driver_1 = __importDefault(require("../../models/Driver"));
const Ride_1 = __importDefault(require("../../models/Ride"));
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const users = await User_1.default.find(query)
            .select('-password')
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });
        const total = await User_1.default.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllUsers = getAllUsers;
const getAllDrivers = async (req, res) => {
    try {
        const { page = 1, limit = 10, approvalStatus, search } = req.query;
        let query = {};
        if (approvalStatus) {
            query.approvalStatus = approvalStatus;
        }
        const drivers = await Driver_1.default.find(query)
            .populate('userId', 'name email phone isBlocked')
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });
        // Filter by search if provided
        let filteredDrivers = drivers;
        if (search) {
            filteredDrivers = drivers.filter(driver => driver.userId &&
                (typeof driver.userId === 'object' && 'name' in driver.userId && 'email' in driver.userId) &&
                (driver.userId.name?.toLowerCase().includes(search.toLowerCase()) ||
                    driver.userId.email?.toLowerCase().includes(search.toLowerCase())));
        }
        const total = await Driver_1.default.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get all drivers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get drivers',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllDrivers = getAllDrivers;
const getAllRides = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }
        const rides = await Ride_1.default.find(query)
            .populate('riderId', 'name email phone')
            .populate('driverId', 'name email phone')
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });
        const total = await Ride_1.default.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get all rides error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get rides',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllRides = getAllRides;
const approveDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvalStatus } = req.body;
        if (!['approved', 'suspended', 'pending'].includes(approvalStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid approval status',
            });
        }
        const driver = await Driver_1.default.findByIdAndUpdate(id, { approvalStatus }, { new: true }).populate('userId', 'name email');
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
    }
    catch (error) {
        console.error('Approve driver error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update driver status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.approveDriver = approveDriver;
const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { isBlocked }, { new: true }).select('-password');
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
    }
    catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.blockUser = blockUser;
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalRiders = await User_1.default.countDocuments({ role: 'rider' });
        const totalDrivers = await Driver_1.default.countDocuments();
        const approvedDrivers = await Driver_1.default.countDocuments({ approvalStatus: 'approved' });
        const onlineDrivers = await Driver_1.default.countDocuments({ isOnline: true, approvalStatus: 'approved' });
        const totalRides = await Ride_1.default.countDocuments();
        const completedRides = await Ride_1.default.countDocuments({ status: 'completed' });
        const activeRides = await Ride_1.default.countDocuments({
            status: { $in: ['requested', 'accepted', 'picked_up', 'in_transit'] }
        });
        // Calculate total revenue
        const revenueData = await Ride_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard statistics',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=adminController.js.map