// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2DFxH1w2U2XIhAamwDzXYGJPBcQkeNRw",
  authDomain: "sessions-fae79.firebaseapp.com",
  projectId: "sessions-fae79",
  storageBucket: "sessions-fae79.firebasestorage.app",
  messagingSenderId: "825913726657",
  appId: "1:825913726657:web:d327360fabe3db76896640"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();