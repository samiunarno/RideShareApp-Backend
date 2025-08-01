import mongoose, { Schema } from 'mongoose';
import { IDriver } from '../types/index';

const driverSchema = new Schema<IDriver>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
  },
  vehicleInfo: {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [2000, 'Vehicle must be from year 2000 or later'],
    },
    plateNumber: {
      type: String,
      required: [true, 'Plate number is required'],
      unique: true,
    },
    color: {
      type: String,
      required: [true, 'Vehicle color is required'],
    },
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'suspended'],
    default: 'pending',
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IDriver>('Driver', driverSchema);