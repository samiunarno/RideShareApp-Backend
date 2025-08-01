import { Response } from 'express';
import Ride from '../../models/Ride';
import Driver from '../../models/Driver';
import { AuthRequest } from '../../types/index';

export const requestRide = async (req: AuthRequest, res: Response) => {
  try {
    const { pickup, destination, paymentMethod } = req.body;
    const riderId = req.user?.userId;

    // Check if rider has any active rides
    const activeRide = await Ride.findOne({
      riderId,
      status: { $in: ['requested', 'accepted', 'picked_up', 'in_transit'] },
    });

    if (activeRide) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active ride',
      });
    }

    // Calculate fare based on distance (simple calculation)
    const distance = calculateDistance(
      pickup.coordinates.latitude,
      pickup.coordinates.longitude,
      destination.coordinates.latitude,
      destination.coordinates.longitude
    );
    
    const baseFare = 50;
    const perKmRate = 15;
    const fare = baseFare + (distance * perKmRate);

    const ride = await Ride.create({
      riderId,
      pickup,
      destination,
      fare: Math.round(fare),
      distance: Math.round(distance * 100) / 100,
      paymentMethod: paymentMethod || 'cash',
    });

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      data: ride,
    });
  } catch (error) {
    console.error('Request ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request ride',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getRideHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let query: any = {};
    
    if (role === 'rider') {
      query.riderId = userId;
    } else if (role === 'driver') {
      query.driverId = userId;
    }

    const rides = await Ride.find(query)
      .populate('riderId', 'name email phone')
      .populate('driverId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rides,
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ride history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const cancelRide = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const riderId = req.user?.userId;

    const ride = await Ride.findOne({ _id: id, riderId });
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel ride after driver has accepted',
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.json({
      success: true,
      message: 'Ride cancelled successfully',
      data: ride,
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAvailableRides = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = req.user?.userId;

    // Check if driver is approved and online
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver || driver.approvalStatus !== 'approved' || !driver.isOnline) {
      return res.status(403).json({
        success: false,
        message: 'Driver must be approved and online to view available rides',
      });
    }

    // Check if driver has active ride
    const activeRide = await Ride.findOne({
      driverId,
      status: { $in: ['accepted', 'picked_up', 'in_transit'] },
    });

    if (activeRide) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active ride',
      });
    }

    const availableRides = await Ride.find({ status: 'requested' })
      .populate('riderId', 'name phone')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: availableRides,
    });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available rides',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateRideStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const driverId = req.user?.userId;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    // For accepting ride
    if (status === 'accepted' && ride.status === 'requested') {
      // Check if driver is approved and online
      const driver = await Driver.findOne({ userId: driverId });
      if (!driver || driver.approvalStatus !== 'approved' || !driver.isOnline) {
        return res.status(403).json({
          success: false,
          message: 'Driver must be approved and online',
        });
      }

      // Check if driver has active ride
      const activeRide = await Ride.findOne({
        driverId,
        status: { $in: ['accepted', 'picked_up', 'in_transit'] },
      });

      if (activeRide) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active ride',
        });
      }

      ride.driverId = driverId;
      ride.status = status;
    } else if (ride.driverId === driverId) {
      // Validate status transitions
      const validTransitions: { [key: string]: string[] } = {
        accepted: ['picked_up'],
        picked_up: ['in_transit'],
        in_transit: ['completed'],
      };

      if (!validTransitions[ride.status]?.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status transition',
        });
      }

      ride.status = status;

      // Update driver earnings and total rides when ride is completed
      if (status === 'completed') {
        await Driver.findOneAndUpdate(
          { userId: driverId },
          {
            $inc: { earnings: ride.fare, totalRides: 1 },
          }
        );
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this ride',
      });
    }

    await ride.save();

    res.json({
      success: true,
      message: 'Ride status updated successfully',
      data: ride,
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}