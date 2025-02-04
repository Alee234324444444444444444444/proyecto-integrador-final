// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlTvxGaK4Q6RuoNTzwuv4oVtxHDutl8Ac",
  authDomain: "login-f39e8.firebaseapp.com",
  projectId: "login-f39e8",
  storageBucket: "login-f39e8.firebasestorage.app",
  messagingSenderId: "516305068886",
  appId: "1:516305068886:web:bfe17445680f01f5762cf7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();