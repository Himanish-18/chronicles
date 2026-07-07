import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { api } from './api';

export const socialAuthService = {
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return this.postSocialToken(idToken);
  },

  async signInWithGitHub() {
    const result = await signInWithPopup(auth, githubProvider);
    const idToken = await result.user.getIdToken();
    return this.postSocialToken(idToken);
  },

  async postSocialToken(idToken: string) {
    // Post to our backend social auth endpoint
    const response = await api.post<{ user: any; token: string }>('/auth/social', { idToken });
    return response;
  }
};
