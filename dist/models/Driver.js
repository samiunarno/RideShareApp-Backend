"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        unique: true,
    },
    vehicleInfo: {
        make: {
            type: String,
            required: [true, 'Vehicle make is required'],
        },
        model: {
            type: String,
            required: [true, 'Vehicle model is required'],
        },
        year: {
            type: Number,
            required: [true, 'Vehicle year is required'],
            min: [2000, 'Vehicle must be from year 2000 or later'],
        },
        plateNumber: {
            type: String,
            required: [true, 'Plate number is required'],
            unique: true,
        },
        color: {
            type: String,
            required: [true, 'Vehicle color is required'],
        },
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'suspended'],
        default: 'pending',
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    earnings: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 0,
        max: 5,
    },
    totalRides: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Driver', driverSchema);
//# sourceMappingURL=Driver.js.map