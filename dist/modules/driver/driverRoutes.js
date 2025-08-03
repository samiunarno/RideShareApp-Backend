"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driverController_1 = require("./driverController");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.get('/profile', auth_1.authenticate, (0, auth_1.authorize)('driver'), driverController_1.getDriverProfile);
router.patch('/online-status', auth_1.authenticate, (0, auth_1.authorize)('driver'), driverController_1.updateOnlineStatus);
router.get('/earnings', auth_1.authenticate, (0, auth_1.authorize)('driver'), driverController_1.getEarnings);
exports.default = router;
//# sourceMappingURL=driverRoutes.js.map