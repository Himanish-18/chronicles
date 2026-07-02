import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

/**
 * Fields to exclude from user responses (never leak password hash).
 */
const userSelectFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  bio: true,
  role: true,
  socialLinks: true,
  createdAt: true,
} as const;

export const userRepository = {
  /**
   * Find a user by ID (without password hash).
   */
  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userSelectFields,
    });
  },

  /**
   * Find a user by email (includes password hash for auth).
   */
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  },

  /**
   * Find a user by email (without password hash — for profile responses).
   */
  async findByEmailSafe(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: userSelectFields,
    });
  },

  /**
   * Create a new user.
   */
  async create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({
      data,
      select: userSelectFields,
    });
  },

  /**
   * Update a user's profile fields.
   */
  async updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelectFields,
    });
  },

  /**
   * Update a user's password hash.
   */
  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    });
  },

  /**
   * Soft-delete a user.
   */
  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
