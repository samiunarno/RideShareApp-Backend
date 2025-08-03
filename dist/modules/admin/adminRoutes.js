"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("./adminController");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
// All admin routes require admin authentication
router.use(auth_1.authenticate, (0, auth_1.authorize)('admin'));
router.get('/stats', adminController_1.getDashboardStats);
router.get('/users', adminController_1.getAllUsers);
router.get('/drivers', adminController_1.getAllDrivers);
router.get('/rides', adminController_1.getAllRides);
router.patch('/drivers/:id/approve', adminController_1.approveDriver);
router.patch('/users/:id/block', adminController_1.blockUser);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map