import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository.js';
import { refreshTokenRepository } from '../repositories/refreshToken.repository.js';
import { passwordResetRepository } from '../repositories/passwordReset.repository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { generateResetToken, sendPasswordResetEmail } from '../utils/email.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors.js';
import type { UserResponse } from '../types/index.js';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '../schemas/auth.schema.js';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const RESET_TOKEN_EXPIRY_HOURS = 1;

/**
 * Format a Prisma user record into the frontend User type.
 */
function formatUser(user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  socialLinks: unknown;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role.toLowerCase() as 'user' | 'admin',
    createdAt: user.createdAt.toISOString(),
    socialLinks: user.socialLinks as UserResponse['socialLinks'],
  };
}

export const authService = {
  /**
   * Register a new user.
   */
  async register(input: RegisterInput) {
    // Check if email already exists
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });

    return {
      user: formatUser(user),
      token: accessToken,
    };
  },

  /**
   * Login with email and password.
   */
  async login(input: LoginInput) {
    // Find user (includes passwordHash)
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });

    // Create refresh token
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return {
      user: formatUser({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt,
      }),
      token: accessToken,
      refreshToken,
    };
  },

  /**
   * Logout — revoke all refresh tokens for user.
   */
  async logout(userId: string) {
    await refreshTokenRepository.revokeAllForUser(userId);
  },

  /**
   * Refresh access token using a valid refresh token.
   */
  async refreshToken(token: string) {
    const stored = await refreshTokenRepository.findValid(token);
    if (!stored) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Revoke the used refresh token
    await refreshTokenRepository.revoke(token);

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: stored.userId,
      role: stored.user.role,
    });
    const newRefreshToken = generateRefreshToken({
      userId: stored.userId,
      role: stored.user.role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await refreshTokenRepository.create(stored.userId, newRefreshToken, expiresAt);

    return {
      token: accessToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Get the current user's profile.
   */
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return formatUser(user);
  },

  /**
   * Update the current user's profile.
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await userRepository.updateProfile(userId, input);
    return formatUser(user);
  },

  /**
   * Change the current user's password.
   */
  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId))?.email || '',
    );
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isCurrentValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await userRepository.updatePassword(userId, newHash);

    // Revoke all refresh tokens (force re-login)
    await refreshTokenRepository.revokeAllForUser(userId);
  },

  /**
   * Request a password reset — generates token and sends email.
   */
  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return;
    }

    // Generate reset token
    const rawToken = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

    // Store hashed token
    await passwordResetRepository.create(user.id, rawToken, expiresAt);

    // Send email with raw token
    await sendPasswordResetEmail(user.email, rawToken);
  },

  /**
   * Verify that a password reset token is valid.
   */
  async verifyResetToken(token: string) {
    const resetToken = await passwordResetRepository.findValid(token);
    return { valid: !!resetToken };
  },

  /**
   * Reset password using a valid token.
   */
  async resetPassword(token: string, newPassword: string) {
    const resetToken = await passwordResetRepository.findValid(token);
    if (!resetToken) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await userRepository.updatePassword(resetToken.userId, passwordHash);

    // Mark token as used
    await passwordResetRepository.markUsed(resetToken.id);

    // Revoke all refresh tokens (force re-login)
    await refreshTokenRepository.revokeAllForUser(resetToken.userId);
  },
};
