import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const storageService = {
  uploadCoverImage: async (file: File): Promise<string> => {
    // Generate a unique filename using timestamp and original name
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `blog-covers/${timestamp}_${cleanFileName}`;
    
    const storageRef = ref(storage, path);
    
    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get and return the public download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw error;
    }
  },
};
