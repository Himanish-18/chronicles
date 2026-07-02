import { prisma } from '../config/database.js';
import crypto from 'crypto';

export const refreshTokenRepository = {
  /**
   * Create a new refresh token (stored as SHA-256 hash).
   */
  async create(userId: string, token: string, expiresAt: Date) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });
  },

  /**
   * Find a valid (non-revoked, non-expired) refresh token.
   */
  async findValid(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  },

  /**
   * Revoke a specific refresh token.
   */
  async revoke(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return prisma.refreshToken.updateMany({
      where: { token: hashedToken },
      data: { revokedAt: new Date() },
    });
  },

  /**
   * Revoke all refresh tokens for a user.
   */
  async revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  /**
   * Clean up expired tokens (maintenance task).
   */
  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};
