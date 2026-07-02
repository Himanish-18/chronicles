import { prisma } from '../config/database.js';
import { hashToken } from '../utils/email.js';

export const passwordResetRepository = {
  /**
   * Create a new password reset token (stored as SHA-256 hash).
   * Invalidates all existing tokens for this user first.
   */
  async create(userId: string, token: string, expiresAt: Date) {
    // Invalidate all existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const hashedToken = hashToken(token);
    return prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });
  },

  /**
   * Find a valid (unused, non-expired) password reset token.
   */
  async findValid(token: string) {
    const hashedToken = hashToken(token);
    return prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  },

  /**
   * Mark a token as used.
   */
  async markUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  /**
   * Clean up expired tokens (maintenance task).
   */
  async deleteExpired() {
    return prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};
