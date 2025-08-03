import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const registerSchema: Joi.ObjectSchema<any>;
export declare const loginSchema: Joi.ObjectSchema<any>;
export declare const rideRequestSchema: Joi.ObjectSchema<any>;
export declare const rideStatusSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=validation.d.ts.map