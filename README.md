# NotifierAPI Backend

A robust Node.js backend API featuring user authentication, email verification, token management, and an announcements system. Built using Express.js and Prisma ORM.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Email Services:** Nodemailer

## ✨ Features

- **User Authentication:**
  - Registration & Login
  - JWT Access and Refresh token lifecycle
  - Logout functionality
- **Account Security:**
  - Password hashing
  - Email verification workflow
  - Resend verification emails
- **Announcements API:** Let users retrieve and manage announcements.
- **Error Handling & Validation:** Centralized async error handling and Zod schema validation.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A relational database supported by Prisma (e.g., PostgreSQL, MySQL)
- SMTP credentials for email services (e.g., Gmail)

## 🛠️ Installation & Setup

1. **Clone the repository** (if applicable) and navigate to the project root:

   ```bash
   cd NotifierAPI/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and copy the contents from `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Fill in your configuration details:

   ```env
   BASE_URL=http://localhost:3000

   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_pass

   DATABASE_URL=your_database_url
   NODE_ENV=development

   # For generating auth tokens
   ACCESS_SECRET=your_access_secret
   REFRESH_SECRET=your_refresh_secret

   # For token expiry
   ACCESS_EXPIRES_IN=15m
   REFRESH_EXPIRES_IN=7d
   ```

4. **Database Migration & Generation:**
   Apply migrations to your database and generate the Prisma client:

   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database (Optional):**
   ```bash
   npm run seed:announcements
   ```

## 🚀 Running the Server

Start the application in development mode with live-reloading:

```bash
npm run dev
```

The server will start, typically on the port configured or default (e.g., `http://localhost:5001`).

## 📁 Project Structure

```
├── prisma/
│   ├── migrations/         # Database migrations history
│   ├── seed/               # Database seeders
│   └── schema.prisma       # Prisma database schema definition
├── src/
│   ├── config/             # Environment and DB configuration
│   ├── controller/         # Route controllers (Auth, Users, Announcements)
│   ├── middleware/         # Express middlewares (Auth, Error Handler, Validator)
│   ├── routes/             # API routing definitions
│   ├── utils/              # Helper utilities (Email, Tokens, AppError)
│   ├── validators/         # Zod validation schemas
│   └── server.js           # Express app entry point
├── .env.example            # Environment variable template
└── package.json            # Project metadata and scripts
```
