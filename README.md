# 📢 NotifierAPI Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

A robust, enterprise-grade Node.js backend API for managing user authentication, announcements, and notifications. Built with **Express.js** and **Prisma ORM**, this system is engineered for high availability, security, and scalability. It is fully **deployed and hosted on Microsoft Azure**, leveraging cloud-native features for optimal performance.

---

## ✨ Key Features

- **Advanced Authentication & Security**
  - JWT Access and Refresh token lifecycle
  - Role-Based Access Control (RBAC) separating Admin and User privileges
  - Account security: Password hashing (bcryptjs), Email verification workflow, and Password recovery

- **Announcement Management System**
  - Admins can broadcast announcements with priorities, types, and due dates
  - Rich media attachments using Supabase Storage
  - Track user read/unread status and handle assignments/submissions

- **Enterprise-Ready Architecture**
  - **Rate Limiting:** Redis-backed distributed rate limiting to protect against DDoS and brute-force attacks
  - **Validation & Error Handling:** Centralized async error handling and strict Zod schema validation
  - **Documentation:** Auto-generated interactive Swagger OpenAPI documentation

---

## ☁️ Azure Cloud Deployment

NotifierAPI is designed for and actively **deployed on Microsoft Azure**. The deployment architecture takes advantage of Azure's robust ecosystem to ensure enterprise-grade reliability:

- **Azure Virtual Machine:** The backend Node.js API is containerized via Docker and orchestrated on Azure for seamless scaling and zero-downtime deployments.
- **Neon Database for PostgreSQL:** A fully managed, highly available PostgreSQL instance ensures secure and resilient data storage.
- **Azure Cache for Redis:** Provides a distributed, low-latency rate-limiting and caching layer, protecting the API from abuse while keeping response times minimal.
- **CI/CD Integration:** Automated deployment pipelines ensure seamless updates directly to the Azure environment.

---

## 🏗️ Backend Architecture

NotifierAPI utilizes a modern, scalable Request Flow Architecture:

1. **Routing & Middlewares** — Requests pass through security headers (Helmet), JWT validation, RBAC checks, and Zod schema validation.
2. **Rate Limiting (Redis)** — Distributed counter store to throttle requests efficiently, preventing resource exhaustion.
3. **Controllers & Services** — Core business logic handling announcements, users, and authentications.
4. **Data Access (Prisma ORM)** — Type-safe queries to a PostgreSQL database.
5. **Storage (Supabase)** — Secure cloud object storage for profile pictures and announcement attachments.

### Database Schema Highlights

- **User** — Manages authentication, roles, profile pictures, and verification status.
- **Announcement & Attachments** — Handles global/targeted broadcasts and associated files.
- **ReadStatus** — Tracks real-time read receipts per user per announcement.
- **Submission** — Supports interactive announcements (assignments) tracking user submissions and grades.

---

## 🐳 Docker Deployment

NotifierAPI is fully containerized, making it trivial to deploy consistently across environments.

The included `docker-compose.yml` orchestrates two core services:

- **`backend`** — The Node.js Express API.
- **`redis`** — In-memory store for rate limiting and fast caching.

> **Note:** PostgreSQL should be provided externally or added to the compose stack.

---

## 🛠️ How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database
- [Docker](https://www.docker.com/) (optional, for Redis and containerized runs)
- SMTP credentials (e.g., Gmail)
- Supabase account (for storage)

### Step-by-Step Guide

**1. Clone the repository and install dependencies:**

```bash
cd NotifierAPI/backend
npm install
```

**2. Environment Configuration:**

Copy the sample environment file and fill in your credentials:

```bash
cp .env.example .env
```

Ensure you provide valid `DATABASE_URL` (PostgreSQL), `REDIS_URL` (or fallback to local), SMTP, and Supabase credentials in the `.env` file.

**3. Start Redis infrastructure (via Docker):**

```bash
docker-compose up -d redis
```

**4. Database Migration:**

Apply migrations to your PostgreSQL database and generate the Prisma Client:

```bash
npx prisma migrate dev
```

**5. Start the Application:**

Run the development server with live-reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:5001`.

**6. Run via Docker Compose (Full Stack):**

Alternatively, run the entire backend and Redis stack via Docker:

```bash
docker-compose up --build
```

---

## 📖 API Documentation (Swagger)

Interactive API documentation is generated dynamically from Zod schemas. Once the application is running, visit:

👉 **[http://localhost:5001/api-docs](http://localhost:5001/api-docs)**

---

## 📁 Project Structure

```text
├── prisma/
│   ├── migrations/         # Database migration history
│   ├── seed/               # Database seed scripts
│   └── schema.prisma       # Prisma database schema definition
├── src/
│   ├── config/             # DB, Redis, Env, and Swagger configs
│   ├── controllers/        # Route controllers (Auth, Users, Announcements)
│   ├── middlewares/        # Auth, Rate Limiter, Error Handler, Uploads, etc.
│   ├── routes/             # API routing definitions (Express routers)
│   ├── utils/              # Helper utilities (Emails, Tokens, AppError)
│   ├── validators/         # Zod validation schemas
│   └── server.js           # Express app entry point
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Container build instructions
└── package.json            # Dependencies and scripts
```
