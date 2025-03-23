import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyCrPxEF1VuqaG1omqFZXyfZ_x-MYV_GPuo",
  authDomain: "prodease-2edd4.firebaseapp.com",
  projectId: "prodease-2edd4",
  storageBucket: "prodease-2edd4.firebasestorage.app",
  messagingSenderId: "156123334986",
  appId: "1:156123334986:web:9f2f0e9596433df60a99b3",
  measurementId: "G-XQ4NYFWC05",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const firestore = getFirestore(app);
const storage = getStorage(app);
export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  firestore,
  storage
};
