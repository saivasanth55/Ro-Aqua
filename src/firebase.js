// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB4xB9r_JOKKv7Ov_7wUMH9XgshpzwztOY",
  authDomain: "ro-water-monitoring.firebaseapp.com",
  projectId: "ro-water-monitoring",
  storageBucket: "ro-water-monitoring.firebasestorage.app",
  messagingSenderId: "676895429201",
  appId: "1:676895429201:web:b2645f4b2749e02b359e70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);