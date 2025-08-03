import { Document } from 'mongoose';
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'rider' | 'driver' | 'admin';
    phone?: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IDriver extends Document {
    _id: string;
    userId: string;
    licenseNumber: string;
    vehicleInfo: {
        make: string;
        model: string;
        year: number;
        plateNumber: string;
        color: string;
    };
    approvalStatus: 'pending' | 'approved' | 'suspended';
    isOnline: boolean;
    earnings: number;
    rating: number;
    totalRides: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IRide extends Document {
    _id: string;
    riderId: string;
    driverId?: string;
    pickup: {
        address: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    destination: {
        address: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
    fare: number;
    distance: number;
    duration: number;
    paymentMethod: 'cash' | 'card';
    statusHistory: Array<{
        status: string;
        timestamp: Date;
        updatedBy: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
import { Request } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
//# sourceMappingURL=index.d.ts.map