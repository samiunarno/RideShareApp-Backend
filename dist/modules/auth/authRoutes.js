"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const validation_1 = require("../../middlewares/validation");
const router = express_1.default.Router();
router.post('/register', (0, validation_1.validateRequest)(validation_1.registerSchema), authController_1.register);
router.post('/login', (0, validation_1.validateRequest)(validation_1.loginSchema), authController_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map