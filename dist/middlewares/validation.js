"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideStatusSchema = exports.rideRequestSchema = exports.loginSchema = exports.registerSchema = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
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
exports.validateRequest = validateRequest;
// Validation schemas
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('rider', 'driver').required(),
    phone: joi_1.default.string().pattern(/^[0-9+\-\s()]+$/).optional(),
    // Driver-specific fields
    licenseNumber: joi_1.default.when('role', {
        is: 'driver',
        then: joi_1.default.string().required(),
        otherwise: joi_1.default.forbidden(),
    }),
    vehicleInfo: joi_1.default.when('role', {
        is: 'driver',
        then: joi_1.default.object({
            make: joi_1.default.string().required(),
            model: joi_1.default.string().required(),
            year: joi_1.default.number().min(2000).required(),
            plateNumber: joi_1.default.string().required(),
            color: joi_1.default.string().required(),
        }).required(),
        otherwise: joi_1.default.forbidden(),
    }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.rideRequestSchema = joi_1.default.object({
    pickup: joi_1.default.object({
        address: joi_1.default.string().required(),
        coordinates: joi_1.default.object({
            latitude: joi_1.default.number().min(-90).max(90).required(),
            longitude: joi_1.default.number().min(-180).max(180).required(),
        }).required(),
    }).required(),
    destination: joi_1.default.object({
        address: joi_1.default.string().required(),
        coordinates: joi_1.default.object({
            latitude: joi_1.default.number().min(-90).max(90).required(),
            longitude: joi_1.default.number().min(-180).max(180).required(),
        }).required(),
    }).required(),
    paymentMethod: joi_1.default.string().valid('cash', 'card').optional(),
});
exports.rideStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('accepted', 'picked_up', 'in_transit', 'completed', 'cancelled').required(),
});
//# sourceMappingURL=validation.js.map