# 🚀 GearUp Backend

GearUp is a backend API for a gear rental platform where users can browse gear items, rent equipment, manage rental orders, make payments, and leave reviews. The system includes authentication, role-based authorization, admin management, and payment integration.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT based authentication
- Access token & refresh token system
- Role-based authorization
- Secure password hashing with bcrypt

### 👤 User Management
- User profile management
- Update user information
- Admin user management

### 🏕️ Gear Management
- Create gear items
- Update gear details
- Delete gear items
- Browse available gears
- Category based filtering
- Provider management

### 📦 Rental System
- Create rental orders
- Manage rental status
- Track rental history
- User specific rental data

### 💳 Payment System
- Stripe payment integration
- Payment tracking
- Secure checkout flow

### ⭐ Review System
- Add reviews
- Calculate average ratings
- Automatically update gear ratings

### 🛠️ Admin Features
- Manage users
- Manage gears
- Manage categories
- Monitor platform activities


# 🧰 Tech Stack

## Backend
- Node.js
- Express.js
- TypeScript

## Database
- PostgreSQL
- Prisma ORM

## Authentication
- JWT
- bcrypt

## Payment
- Stripe

## Deployment
- Vercel


# 📁 Project Structure

```
src
│
├── app.ts
├── server.ts
│
├── config
│
├── lib
│   ├── prisma.ts
│   └── stripe.ts
│
├── middleware
│
├── module
│   │
│   ├── auth
│   ├── user
│   ├── category
│   ├── gearItem
│   ├── rentalOrder
│   ├── payment
│   ├── review
│   └── admin
│
└── utils
```


# ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/mehadishisir/gearUp_Backend.git
```

Go to project folder:

```bash
cd gearUp_Backend
```

Install dependencies:

```bash
npm install
```


# 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL="your_postgresql_database_url"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

STRIPE_SECRET_KEY="your_stripe_secret_key"
```


# 🗄️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migration:

```bash
npx prisma migrate dev
```


# ▶️ Run Project

Development:

```bash
npm run dev
```

Production Build:

```bash
npm run build
```

Start Server:

```bash
npm start
```


# 🌐 API Base URL

Production:

```
https://gear-up-backend-one.vercel.app
```


# 📌 API Endpoints

## Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
```


## Categories

```
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```


## Gear Items

```
GET    /api/gear
POST   /api/gear
PATCH  /api/gear/:id
DELETE /api/gear/:id
```


## Rental Orders

```
POST   /api/rentals
GET    /api/rentals
PATCH  /api/rentals/:id
```


## Payments

```
POST   /api/payments
```


## Reviews

```
POST   /api/reviews
GET    /api/reviews
```


# 🧪 Testing

API testing tools:

- Postman
- Thunder Client


# 🚀 Deployment

The backend is deployed using Vercel Serverless Functions.

Live URL:

```
https://gear-up-backend-one.vercel.app
```


# 👨‍💻 Developer

## Mehadi Hasan Shisir

Full Stack Developer

GitHub:
https://github.com/mehadishisir

LinkedIn:
https://www.linkedin.com/in/mehadishisir/

Email:
mehadishisir@gmail.com


⭐ If you find this project useful, consider giving it a star.
