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
const rideSchema = new mongoose_1.Schema({
    riderId: {
        type: String,
        required: true,
        ref: 'User',
    },
    driverId: {
        type: String,
        ref: 'User',
    },
    pickup: {
        address: {
            type: String,
            required: [true, 'Pickup address is required'],
        },
        coordinates: {
            latitude: {
                type: Number,
                required: [true, 'Pickup latitude is required'],
                min: [-90, 'Latitude must be between -90 and 90'],
                max: [90, 'Latitude must be between -90 and 90'],
            },
            longitude: {
                type: Number,
                required: [true, 'Pickup longitude is required'],
                min: [-180, 'Longitude must be between -180 and 180'],
                max: [180, 'Longitude must be between -180 and 180'],
            },
        },
    },
    destination: {
        address: {
            type: String,
            required: [true, 'Destination address is required'],
        },
        coordinates: {
            latitude: {
                type: Number,
                required: [true, 'Destination latitude is required'],
                min: [-90, 'Latitude must be between -90 and 90'],
                max: [90, 'Latitude must be between -90 and 90'],
            },
            longitude: {
                type: Number,
                required: [true, 'Destination longitude is required'],
                min: [-180, 'Longitude must be between -180 and 180'],
                max: [180, 'Longitude must be between -180 and 180'],
            },
        },
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
        default: 'requested',
    },
    fare: {
        type: Number,
        default: 0,
    },
    distance: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash',
    },
    statusHistory: [{
            status: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            updatedBy: {
                type: String,
                required: true,
            },
        }],
}, {
    timestamps: true,
});
// Add status to history before saving
rideSchema.pre('save', function (next) {
    if (this.isModified('status') || this.isNew) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            updatedBy: (this.driverId || this.riderId),
        });
    }
    next();
});
exports.default = mongoose_1.default.model('Ride', rideSchema);
//# sourceMappingURL=Ride.js.map