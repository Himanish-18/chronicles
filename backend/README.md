# Chronicles Backend

Production-ready Node.js/Express backend for the Chronicles blogging platform.

## Features

- **Express 5** with TypeScript
- **Prisma ORM** with MySQL 8
- **JWT Authentication** with Access (15m) & Refresh (7d) token rotation
- **Email-based Password Reset** with crypto-secure single-use tokens (via Nodemailer)
- **Zod Validation** for all inputs
- **Security**: Helmet, CORS, Rate Limiting (Global, Auth, Password Reset)
- **Error Handling**: Centralized custom error classes
- **Soft Deletes**: Configured for Users, Blogs, and Comments

## Prerequisites

- Node.js 22 LTS
- MySQL 8

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
   *Note: For password reset emails in development, use a Gmail App Password.*

3. **Database Setup:**
   Ensure MySQL is running, then create the database schema and seed initial data:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

## Development

Run the development server with hot-reload (via `tsx`):

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Run the compiled production build
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run pending migrations in development
- `npm run prisma:migrate:prod`: Deploy migrations in production
- `npm run prisma:seed`: Seed database with categories
- `npm run prisma:studio`: Open Prisma Studio UI for database management
