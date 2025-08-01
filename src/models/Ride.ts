import mongoose, { Schema } from 'mongoose';
import { IRide } from '../types/index';

const rideSchema = new Schema<IRide>({
  riderId: {
    type: String,
    required: true,
    ref: 'User',
  },
  driverId: {
    type: String,
    ref: 'User',
  },
  pickup: {
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Pickup latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        required: [true, 'Pickup longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  destination: {
    address: {
      type: String,
      required: [true, 'Destination address is required'],
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Destination latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
      },
      longitude: {
        type: Number,
        required: [true, 'Destination longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
      },
    },
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
    default: 'requested',
  },
  fare: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash',
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

// Add status to history before saving
rideSchema.pre('save', function (next) {
  if (this.isModified('status') || this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: (this.driverId || this.riderId) as string,
    });
  }
  next();
});

export default mongoose.model<IRide>('Ride', rideSchema);