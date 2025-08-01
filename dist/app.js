"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import database connection
const database_1 = __importDefault(require("./config/database"));
// Import middleware
const errorHandler_1 = require("./middlewares/errorHandler");
// Import routes
const authRoutes_1 = __importDefault(require("./modules/auth/authRoutes"));
const rideRoutes_1 = __importDefault(require("./modules/ride/rideRoutes"));
const driverRoutes_1 = __importDefault(require("./modules/driver/driverRoutes"));
const adminRoutes_1 = __importDefault(require("./modules/admin/adminRoutes"));
// Import route logger
const logRoutes_1 = require("./logRoutes");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Connect to database
(0, database_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// Body parser middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Ride Booking API is running!',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/rides', rideRoutes_1.default);
app.use('/api/drivers', driverRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Ride Booking API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            rides: '/api/rides',
            drivers: '/api/drivers',
            admin: '/api/admin',
        },
    });
});
// Error handling middleware
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseUrl = `http://localhost:${PORT}`;
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: ${baseUrl}/`);
    (0, logRoutes_1.logRoutes)(app, baseUrl); // ✅ Correct usage
});
exports.default = app;
//# sourceMappingURL=app.js.map