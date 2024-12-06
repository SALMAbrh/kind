// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth from firebase/auth
import { getAnalytics } from "firebase/analytics"; // This is optional, remove if not used

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASQGxmHPAnOuqogJ-GshsKxZs7z_rVFhc",
  authDomain: "cloud-pro-salma.firebaseapp.com",
  projectId: "cloud-pro-salma",
  storageBucket: "cloud-pro-salma.firebasestorage.app",
  messagingSenderId: "270378042783",
  appId: "1:270378042783:web:7d23dc50345ca548b329aa",
  measurementId: "G-HCN9MZ9RYX"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app); // Fix: Export the auth instance

// Optional: Initialize Analytics if you need it
const analytics = getAnalytics(app);
