import { Request, Response } from 'express';
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const getAllDrivers: (req: Request, res: Response) => Promise<void>;
export declare const getAllRides: (req: Request, res: Response) => Promise<void>;
export declare const approveDriver: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const blockUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map