import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3UGv59cqp1CCC8QFjjiHYKKPe7kKGYFI",
  authDomain: "resume-1d8e5.firebaseapp.com",
  projectId: "resume-1d8e5",
  storageBucket: "resume-1d8e5.firebasestorage.app",
  messagingSenderId: "332440764518",
  appId: "1:332440764518:web:e1aed943bffbbcde6c6da7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
