# 🚗 Ride Booking API

A secure, scalable, and role-based backend API for a ride booking system (like Uber or Pathao) built with Express.js, TypeScript, and MongoDB.

## 🎯 Features

- **🔐 JWT-based Authentication** with secure password hashing
- **🎭 Role-based Authorization** (rider, driver, admin)
- **🧍 Rider Features**: Request rides, cancel rides, view history
- **🚘 Driver Features**: Accept/reject rides, update status, manage earnings
- **🛠 Admin Features**: Manage users, drivers, rides, and system oversight
- **📁 Modular Architecture** with clean separation of concerns
- **🌐 RESTful API Design** with comprehensive endpoints
- **⚡ Real-time Ride Management** with status tracking

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Validation**: Joi for request validation
- **Development**: Nodemon, ts-node

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### 1. Clone the repository
```bash
git clone <repository-url>
cd ride-booking-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://samiunarnouk:mongodb@cluster0.an79t.mongodb.net/ridesharingdb?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=a5f8b9c2d1e6f4a7b3c8d9e2f1a4b7c6d3e8f9a2b5c7d1e4f6a9b2c5d8e1f4a7b3c6d9e2f5a8
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=*
```

### 4. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Production build
```bash
npm run build
npm start
```

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |

### Rides
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/rides/request` | Request a ride | Rider |
| GET | `/api/rides/me` | Get ride history | Rider/Driver |
| PATCH | `/api/rides/:id/cancel` | Cancel ride | Rider |
| GET | `/api/rides/available` | Get available rides | Driver |
| PATCH | `/api/rides/:id/status` | Update ride status | Driver |

### Drivers
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/drivers/profile` | Get driver profile | Driver |
| PATCH | `/api/drivers/online-status` | Update online status | Driver |
| GET | `/api/drivers/earnings` | Get earnings summary | Driver |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/drivers` | Get all drivers | Admin |
| GET | `/api/admin/rides` | Get all rides | Admin |
| PATCH | `/api/admin/drivers/:id/approve` | Approve/suspend driver | Admin |
| PATCH | `/api/admin/users/:id/block` | Block/unblock user | Admin |

## 🔐 Authentication & Authorization

### Registration
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "rider", // or "driver"
  "phone": "+1234567890",
  // For drivers only:
  "licenseNumber": "DL123456",
  "vehicleInfo": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "plateNumber": "ABC123",
    "color": "White"
  }
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Using JWT Token
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🚗 Ride Lifecycle

1. **Requested** - Rider requests a ride
2. **Accepted** - Driver accepts the ride
3. **Picked Up** - Driver picks up the rider
4. **In Transit** - Ride is in progress
5. **Completed** - Ride is finished
6. **Cancelled** - Ride is cancelled (only in 'requested' status)

## 👥 User Roles & Permissions

### Rider
- Request rides with pickup and destination
- Cancel rides (only in 'requested' status)
- View personal ride history
- Cannot have multiple active rides

### Driver
- View available ride requests
- Accept or reject rides
- Update ride status through the lifecycle
- View earnings and ride statistics
- Set online/offline status
- Must be approved by admin to accept rides

### Admin
- View all users, drivers, and rides
- Approve or suspend drivers
- Block or unblock users
- Access dashboard statistics
- Manage system operations

## 🗂 Project Structure

```
src/
├── app.ts                 # Main application file
├── config/
│   ├── database.ts        # MongoDB connection
│   └── jwt.ts            # JWT utilities
├── middlewares/
│   ├── auth.ts           # Authentication middleware
│   ├── validation.ts     # Request validation
│   └── errorHandler.ts   # Error handling
├── models/
│   ├── User.ts           # User model
│   ├── Driver.ts         # Driver model
│   └── Ride.ts           # Ride model
├── modules/
│   ├── auth/             # Authentication module
│   ├── ride/             # Ride management module
│   ├── driver/           # Driver module
│   └── admin/            # Admin module
└── types/
    └── index.ts          # TypeScript type definitions
```

## 🧪 Testing with Postman

### Import Collection
Download the Postman collection: [Ride Booking API Collection](https://documenter.getpostman.com/view/your-collection-id/ride-booking-api)

### Testing Flow
1. **Register** a new user (rider/driver)
2. **Login** to get JWT token
3. **Set Authorization** header with the token
4. **Test role-specific endpoints**:
   - Rider: Request ride, view history, cancel ride
   - Driver: Set online, view available rides, accept ride, update status
   - Admin: View dashboard, manage users/drivers

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGIN` | CORS allowed origins | * |

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🛡 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Request Validation** using Joi schemas
- **Role-based Access Control** for endpoints

## 📝 Business Rules

- Riders cannot request multiple simultaneous rides
- Drivers can only have one active ride at a time
- Suspended drivers cannot accept rides
- Rides can only be cancelled in 'requested' status
- Only approved and online drivers can accept rides
- Status transitions follow a strict lifecycle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using Node.js, Express.js, TypeScript, and MongoDB**