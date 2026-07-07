# Phase 5: Containerization Report

## Overview
Phase 5 focused on containerizing the Chronicles multi-service architecture using Docker and Docker Compose. This allows for a consistent, reproducible deployment environment that can be easily spun up on any machine.

## Components Containerized

### 1. MySQL Database (`mysql`)
- Used the official `mysql:8.0` image.
- Configured with environment variables for root password, user, password, and database name.
- Created a persistent volume (`chronicles-mysql-data`) to retain data across container restarts.
- Implemented a healthcheck to ensure the database is fully ready before dependent services start.

### 2. Database Migrations (`migrate`)
- Created a lightweight Node.js container based on `node:20-alpine`.
- Connects to the `mysql` service.
- Runs `npx prisma db push` to apply the database schema.
- Runs as a one-shot service that exits successfully once migrations are applied.

### 3. Backend API (`backend`)
- Implemented a multi-stage Dockerfile to optimize the final image size.
- The build stage installs all dependencies (including dev dependencies) and compiles the TypeScript code.
- The runtime stage only installs production dependencies, copies the compiled code, and generates the Prisma client.
- Depends on the `mysql` service being healthy and the `migrate` service completing successfully.
- Exposes port 5000 internally to the Docker network.

### 4. React Frontend (`frontend`)
- Implemented a multi-stage Dockerfile for the frontend.
- The build stage installs dependencies and creates a production-optimized build using Vite.
- The runtime stage uses Nginx (`nginx:alpine`) to serve the static files.
- Configured an Nginx reverse proxy (`nginx.conf`) to forward API requests (`/api/*`) to the backend service, resolving CORS issues and maintaining same-origin cookie behavior.
- Exposes port 3000 to the host machine.

## Build and Deployment Process

The entire stack can be built and started with a single command:
```bash
docker compose up -d --build
```

This command will:
1. Pull the necessary base images.
2. Build the `frontend` and `backend` images.
3. Start the `mysql` database and wait for it to become healthy.
4. Run the `migrate` container to apply the database schema.
5. Start the `backend` and `frontend` services.

## Local Testing and Validation

The application is now accessible at `http://localhost:3000`. 
- **Frontend**: The React application is served by Nginx on port 3000.
- **Backend API**: The backend is reachable via the frontend proxy at `http://localhost:3000/api`.
- **Database**: The MySQL database is accessible on port 3306 for direct inspection.

### Recommended Manual Tests:
1. Open a browser and navigate to `http://localhost:3000`.
2. Verify the application loads correctly.
3. Attempt to register a new user or log in with an existing user.
4. Test the OAuth login flow (Google/GitHub).
5. Perform CRUD operations (e.g., creating, reading, updating, or deleting a post).

## Conclusion
Phase 5 successfully containerized the Chronicles application, providing a robust, reproducible, and easily deployable environment. This sets the stage for future phases, such as continuous integration and continuous deployment (CI/CD) or Kubernetes orchestration.
