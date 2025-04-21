// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpaUXz5mQyF6QDedXGLp6tzAS8wwSO6Rg",
  authDomain: "ashoka-elections.firebaseapp.com",
  projectId: "ashoka-elections",
  storageBucket: "ashoka-elections.firebasestorage.app",
  messagingSenderId: "1032245270764",
  appId: "1:1032245270764:web:272f95c46c3eec41002dc9",
  measurementId: "G-9LCNFGXRYM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);