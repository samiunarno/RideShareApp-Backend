import { Response } from 'express';
import { AuthRequest } from '../../types/index';
export declare const requestRide: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRideHistory: (req: AuthRequest, res: Response) => Promise<void>;
export declare const cancelRide: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAvailableRides: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRideStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=rideController.d.ts.map