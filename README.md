# 🏠 RentNest Backend API

A secure and scalable RESTful backend for **RentNest**, a rental property management platform where tenants can browse properties, submit rental requests, make online payments, leave reviews, and landlords can manage listings and rental requests. The system also includes an admin panel for managing users, properties, and rentals.

---

## 🚀 Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Roles:
  - Admin
  - Landlord
  - Tenant

### Property Management

- Create, update, and delete property listings (Landlord)
- Public property browsing
- Property details
- Search, filtering, pagination, and sorting

### Categories

- Property category management
- Public category listing

### Rental Requests

- Tenant can submit rental requests
- Tenant can view rental history
- Landlord can view requests for their properties
- Landlord can approve or reject requests

### Payments

- Stripe Checkout integration
- Secure webhook verification
- Payment history
- Payment details
- Automatic rental completion after successful payment

### Reviews

- Tenants can review properties after successfully completing a rental
- Prevent duplicate reviews

### Admin Panel

- View all users
- Ban/Unban users
- View all properties
- View all rental requests

---

# 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Stripe Payment Gateway
- Zod Validation
- bcrypt

---

# 📂 Project Structure

```text
src/
│
├── config/
├── middleware/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── category/
│   ├── payment/
│   ├── property/
│   ├── rental/
│   └── review/
│
├── lib/
├── utils/
├── app.ts
└── server.ts
```

---

# 🗄️ Database Schema

The project database was designed using DrawSQL.

![Database Schema](./assets/database-diagram.png)

---

# 🔐 User Roles

## Admin

- Manage users
- Ban/Unban users
- View all properties
- View all rental requests

## Landlord

- Create property
- Update property
- Delete property
- View rental requests
- Approve or reject rental requests

## Tenant

- Browse properties
- Submit rental requests
- View rental history
- Make payments
- View payment history
- Leave reviews

---

# 🔄 Application Workflow

```text
Tenant Registration/Login
            │
            ▼
Browse Available Properties
            │
            ▼
Submit Rental Request
            │
            ▼
Landlord Approves Request
            │
            ▼
Tenant Completes Stripe Payment
            │
            ▼
Rental Status → COMPLETED
            │
            ▼
Property Status → UNAVAILABLE
            │
            ▼
Tenant Can Leave Review
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |

---

## Categories

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /api/categories |

---

## Properties

| Method | Endpoint            |
| ------ | ------------------- |
| GET    | /api/properties     |
| GET    | /api/properties/:id |

---

## Landlord

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/landlord/properties     |
| PUT    | /api/landlord/properties/:id |
| DELETE | /api/landlord/properties/:id |
| GET    | /api/landlord/requests       |
| PATCH  | /api/landlord/requests/:id   |

---

## Rentals

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /api/rentals     |
| GET    | /api/rentals     |
| GET    | /api/rentals/:id |

---

## Payments

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/payments/create |
| GET    | /api/payments        |
| GET    | /api/payments/:id    |

---

## Reviews

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /api/reviews |

---

## Admin

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /api/admin/users      |
| PATCH  | /api/admin/users/:id  |
| GET    | /api/admin/properties |
| GET    | /api/admin/rentals    |

---

# ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Configure environment variables

Create a `.env` file and add:

```env
PORT=8000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=
JWT_REFRESH_EXPIRY=

ADMIN_EMAIL=
ADMIN_PASSWORD=

BCRYPT_SALT_ROUNDS=10

APP_URL=http://localhost:3000

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start the development server

```bash
npm run dev
```

---

# 🧪 Testing

The API can be tested using:

- Postman
- Thunder Client
- Insomnia

---

# 👨‍💻 Author

**Naimul Islam Omit**

- GitHub: https://github.com/nio420
- Portfolio: https://naimul-islam.vercel.app/

---

# 📄 License

This project was developed for educational and assessment purposes.
