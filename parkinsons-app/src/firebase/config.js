import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

// Avoid initializing twice (e.g. if config is imported from multiple places)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use getAuth - it handles persistence automatically in React Native/Expo
// Do NOT use initializeAuth + getReactNativePersistence as it causes
// "expected dynamic type 'boolean', but had type 'string'" error in RN
export const auth = getAuth(app);
export const db = getFirestore(app);
