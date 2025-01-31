// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyAcTh6Ug1E8J3i5h_gj3RfAbOp7HJgQT9g",
  authDomain: "project-8126162487375064475.firebaseapp.com",
  projectId: "project-8126162487375064475",
  storageBucket: "project-8126162487375064475.firebasestorage.app",
  messagingSenderId: "1059520592672",
  appId: "1:1059520592672:web:b10e2bdc392df8a51e7545",
  measurementId: "G-CBVFBYFSFJ"
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(firebaseApp); // Initialize Firestore
export const storage = getStorage(firebaseApp); // Initialize Firebase Storage
export const facebookProvider = new FacebookAuthProvider();
export default firebaseApp;
