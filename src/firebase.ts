// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyD6mg2L4h1K02mFgBgK8Ij8zfFzNMHoNUw",
  authDomain: "caress-d79cd.firebaseapp.com",
  projectId: "caress-d79cd",
  storageBucket: "caress-d79cd.firebasestorage.app",
  messagingSenderId: "474793383523",
  appId: "1:474793383523:web:7221fc3369298369604a56"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(firebaseApp); // Initialize Firestore
export const storage = getStorage(firebaseApp); // Initialize Firebase Storage
export const facebookProvider = new FacebookAuthProvider();
export default firebaseApp;
