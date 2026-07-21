# Chronicles - Modern Full-Stack Blogging Platform

Chronicles is a production-ready, full-stack blogging platform built with a modern technology stack. It features a responsive React SPA frontend, a robust Express REST API, a Prisma-managed MySQL database, and automated CI/CD deployment to AWS EC2 via Docker Compose.

## Features

- **Modern Authentication**: Supports both traditional email/password login and social login (Google, GitHub) via Firebase Authentication. Features secure JWT-based session management with refresh token rotation and password reset flows.
- **Content Creation**: Rich blog editing experience with cover image uploads (Firebase Storage), categories, tags, and draft/publish states. Automatically estimates reading time and generates URL-friendly slugs.
- **Content Discovery**: Browse, search, and filter blogs. Features trending algorithms, featured posts, and personal bookmarking capabilities.
- **Community Interaction**: Threaded commenting system allowing users to discuss posts and reply to each other.
- **Personalization**: User profiles and customizable themes (Dark/Light mode) persisted to local storage.
- **Production-Ready Architecture**: Containerized with Docker, featuring Nginx reverse proxy, multi-stage builds, tiered rate-limiting, and comprehensive error handling.

## Technology Stack

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS 4, React Router 7, React Hook Form, Zod, TanStack React Query, Framer Motion
- **Backend**: Node.js, Express 5, TypeScript, Prisma ORM, MySQL 8.0, Firebase Admin SDK, JWT, bcrypt, Helmet, Nodemailer
- **Infrastructure & DevOps**: Docker, Docker Compose, Nginx, AWS EC2 (Ubuntu), GitHub Actions

## Repository Structure

- `/frontend`: React SPA application
- `/backend`: Node.js Express API and Prisma schema
- `/scripts`: Deployment and automation scripts
- `/docs`: Extensive documentation including architecture, phase reports, diagrams, and the comprehensive project report.

## Quick Start (Local Development)

### Prerequisites
- Node.js 22+
- Docker and Docker Compose
- A Firebase Project (for Auth and Storage)
- An SMTP server (e.g., Gmail) for emails

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Himanish-18/chronicles.git
   cd chronicles
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env` in the root and configure your database settings.
   - Set up your `.env` files in both the `/frontend` and `/backend` directories based on the required variables (refer to `docs/PROJECT_REPORT.md` Appendix D).

3. **Start with Docker**
   ```bash
   docker compose up -d --build
   ```
   This will spin up the MySQL database, run migrations, start the backend API on an internal network, and expose the frontend on `http://localhost:3000`.

## Deployment

This project utilizes a GitHub Actions CI/CD pipeline for zero-downtime deployments to an AWS EC2 instance. Pushing to the `main` branch automatically triggers the `.github/workflows/deploy.yml` workflow, which SSHs into the server and executes the `scripts/deploy.sh` script to rebuild and restart the Docker containers.

## Documentation

Detailed documentation is available in the `docs` directory:
- [Project Report](docs/PROJECT_REPORT.md) - A comprehensive 40-70 page technical report covering the entire system design, architecture, implementation, and deployment. Also available as [PROJECT_REPORT.docx](docs/PROJECT_REPORT.docx).
- [Architecture Details](docs/architecture.md)
- [Architecture Diagrams](docs/diagrams) (Mermaid)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
