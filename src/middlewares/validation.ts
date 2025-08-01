import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }
    
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('rider', 'driver' , 'admin').required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  // Driver-specific fields
  licenseNumber: Joi.when('role', {
    is: 'driver',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  vehicleInfo: Joi.when('role', {
    is: 'driver',
    then: Joi.object({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().min(2000).required(),
      plateNumber: Joi.string().required(),
      color: Joi.string().required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const rideRequestSchema = Joi.object({
  pickup: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
  }).required(),
  destination: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }).required(),
  }).required(),
  paymentMethod: Joi.string().valid('cash', 'card').optional(),
});

export const rideStatusSchema = Joi.object({
  status: Joi.string().valid('accepted', 'picked_up', 'in_transit', 'completed', 'cancelled').required(),
});