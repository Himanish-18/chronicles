import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// ─────────────────────────────────────────────
// SMTP TRANSPORTER
// ─────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// ─────────────────────────────────────────────
// TOKEN GENERATION
// ─────────────────────────────────────────────

/**
 * Generate a cryptographically secure random token (64 bytes, hex-encoded).
 */
export function generateResetToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Hash a token using SHA-256. Only the hash is stored in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ─────────────────────────────────────────────
// PASSWORD RESET EMAIL
// ─────────────────────────────────────────────

export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #0a0a0f; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 480px; background-color: #13131a; border-radius: 16px; border: 1px solid #1e1e2e; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 32px 24px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Chronicles</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 32px 24px;">
                  <h2 style="margin: 0 0 12px; color: #e4e4e7; font-size: 20px; font-weight: 600;">Reset Your Password</h2>
                  <p style="margin: 0 0 24px; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to choose a new password.
                  </p>
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td align="center" style="padding: 8px 0 24px;">
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  <!-- Expiry Notice -->
                  <div style="background-color: #1a1a24; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5;">
                      ⏱ This link expires in <strong style="color: #e4e4e7;">1 hour</strong>.
                    </p>
                  </div>
                  <!-- Fallback URL -->
                  <p style="margin: 0 0 16px; color: #71717a; font-size: 12px; line-height: 1.5;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0 0 24px; color: #7c3aed; font-size: 12px; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  <!-- Security Note -->
                  <hr style="border: none; border-top: 1px solid #1e1e2e; margin: 20px 0;" />
                  <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 16px 24px; text-align: center; border-top: 1px solid #1e1e2e;">
                  <p style="margin: 0; color: #3f3f46; font-size: 11px;">
                    © ${new Date().getFullYear()} Chronicles. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Reset your Chronicles password',
    html: htmlContent,
    text: `Reset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
  });
}

/**
 * Verify the SMTP connection on startup (non-blocking).
 */
export async function verifyEmailConnection(): Promise<void> {
  try {
    await transporter.verify();
    console.log('📧 SMTP connection verified');
  } catch (error) {
    console.warn('⚠️  SMTP connection failed — password reset emails will not be sent:', error);
  }
}
