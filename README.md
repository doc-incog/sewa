# Sewa - Home Services Platform

A full-stack home services platform connecting users with verified service providers (electricians, plumbers, carpenters, etc.).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| State | Zustand |
| HTTP Client | Axios |

## Features

- **Authentication**: JWT-based auth with user, provider, and admin roles
- **Service Catalog**: Browse 12+ service categories with search and filters
- **Provider Profiles**: View provider details, availability, reviews, and ratings
- **Booking System**: Book services with date/time selection and address
- **Payment**: Card and cash payment options (mock Stripe integration)
- **Reviews & Ratings**: Rate providers after completed bookings
- **Search & Filters**: Advanced search with rating, verified, and sort filters
- **Real-time Chat**: Socket.io-powered messaging between users and providers
- **Notifications**: Real-time in-app notifications
- **Admin Panel**: Dashboard, user/provider/service/booking management

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Docker)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/doc-incog/sewa.git
cd sewa

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Setup

```bash
# Copy server env file
cp server/.env.example server/.env

# Copy client env file
cp client/.env.local.example client/.env.local
```

### Database Setup

Using Docker:
```bash
docker compose up -d
```

Or use a local MongoDB instance.

### Seed Data

```bash
npm run seed
```

This creates:
- **Admin**: admin@sewa.com / admin123
- **User**: ram@test.com / password123
- **Provider**: shyam@test.com / password123
- 12 service categories

### Running the App

```bash
# Start both server and client
npm run dev

# Or start separately
npm run dev:server   # Server on http://localhost:5000
npm run dev:client   # Client on http://localhost:3000
```

## Project Structure

```
sewa/
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Reusable components
│       ├── hooks/         # Custom hooks
│       ├── lib/           # API client, socket
│       └── store/         # Zustand stores
│
├── server/                # Express backend
│   └── src/
│       ├── config/        # DB, env
│       ├── controllers/   # Route handlers
│       ├── middleware/    # Auth, validation, errors
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       └── validators/    # Zod schemas
│
├── shared/                # Shared TypeScript types
└── docker-compose.yml     # MongoDB setup
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/provider/signup` - Register provider
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - List services (filter by category, search)
- `GET /api/services/:id` - Get service details
- `GET /api/services/categories` - List categories

### Providers
- `GET /api/providers` - List providers
- `GET /api/providers/service/:serviceId` - Providers by service
- `GET /api/providers/:id` - Provider profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - User's bookings
- `GET /api/bookings/provider` - Provider's bookings
- `PUT /api/bookings/:id/accept` - Accept booking
- `PUT /api/bookings/:id/complete` - Complete booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/provider/:providerId` - Get provider reviews

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/my` - Payment history
- `GET /api/payments/provider` - Provider earnings

### Search
- `GET /api/search/providers` - Search providers with filters
- `GET /api/search/services` - Search services

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/read-all` - Mark all read

### Chat
- `GET /api/chats` - List chats
- `POST /api/chats/message` - Send message
- `GET /api/chats/:chatId/messages` - Get messages

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/providers` - List providers
- `PUT /api/admin/providers/:id/verify` - Verify provider
- `GET /api/admin/services` - List services
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `GET /api/admin/bookings` - List bookings

## License

MIT
