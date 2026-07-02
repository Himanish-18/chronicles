import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { verifyEmailConnection } from './utils/email.js';

async function bootstrap() {
  try {
    // 1. Connect to database
    await prisma.$connect();
    console.log('📦 Database connected successfully');

    // 2. Verify email config (non-blocking)
    if (env.SMTP_USER && env.SMTP_PASS) {
      await verifyEmailConnection();
    } else {
      console.warn('⚠️  SMTP credentials missing — password reset emails will not work');
    }

    // 3. Start server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
    });

    // 4. Graceful shutdown handler
    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(async () => {
        console.log('HTTP server closed');
        await prisma.$disconnect();
        console.log('Database connection closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
