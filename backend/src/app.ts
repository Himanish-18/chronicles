import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { NotFoundError } from './utils/errors.js';
import routes from './routes/index.js';

const app = express();

// Trust the reverse proxy (Nginx) so rate limiters use the correct client IP
app.set('trust proxy', 1);

// ─────────────────────────────────────────────
// MIDDLEWARE PIPELINE
// ─────────────────────────────────────────────

// 1. Security Headers
app.use(helmet());

// 2. CORS (allow frontend URL + credentials)
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// 3. Request Logging
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// 4. Body Parsing (limit to 10kb)
app.use(express.json({ limit: '10kb' }));

// 5. Cookie Parsing
app.use(cookieParser());

// 6. Global Rate Limiting
app.use('/api', globalLimiter);

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

app.use('/api', routes);

// ─────────────────────────────────────────────
// 404 & ERROR HANDLING
// ─────────────────────────────────────────────

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(new NotFoundError('API endpoint not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
