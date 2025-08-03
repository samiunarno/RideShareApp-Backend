"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rideController_1 = require("./rideController");
const auth_1 = require("../../middlewares/auth");
const validation_1 = require("../../middlewares/validation");
const router = express_1.default.Router();
// Rider routes
router.post('/request', auth_1.authenticate, (0, auth_1.authorize)('rider'), (0, validation_1.validateRequest)(validation_1.rideRequestSchema), rideController_1.requestRide);
router.get('/me', auth_1.authenticate, rideController_1.getRideHistory);
router.patch('/:id/cancel', auth_1.authenticate, (0, auth_1.authorize)('rider'), rideController_1.cancelRide);
// Driver routes
router.get('/available', auth_1.authenticate, (0, auth_1.authorize)('driver'), rideController_1.getAvailableRides);
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)('driver'), (0, validation_1.validateRequest)(validation_1.rideStatusSchema), rideController_1.updateRideStatus);
exports.default = router;
//# sourceMappingURL=rideRoutes.js.map