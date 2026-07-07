import admin from 'firebase-admin';
import 'dotenv/config';

// Load variables from environment
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Handle escaped newlines in the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.warn(
    'Firebase Admin configuration is incomplete. Social authentication will fail.'
  );
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error: any) {
    // Prevent re-initialization error if already initialized
    if (!/already exists/.test(error.message)) {
      console.error('Firebase Admin initialization error', error.stack);
    }
  }
}

export const firebaseAdmin = admin;
