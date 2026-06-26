import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRkHhRkGqrRhl259Ku9pntsEEf5D3GDWo",
  authDomain: "arcade-buddy.firebaseapp.com",
  projectId: "arcade-buddy",
  storageBucket: "arcade-buddy.firebasestorage.app",
  messagingSenderId: "140747124352",
  appId: "1:140747124352:web:0d729910b53b4b3f654065"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);
export const logout = () => signOut(auth);
