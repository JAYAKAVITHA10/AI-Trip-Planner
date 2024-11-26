// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS9ffgZormHOFYNuAH6adOKPFJYrk9-58",
  authDomain: "ai-trip-planner-29b0b.firebaseapp.com",
  projectId: "ai-trip-planner-29b0b",
  storageBucket: "ai-trip-planner-29b0b.firebasestorage.app",
  messagingSenderId: "573734713880",
  appId: "1:573734713880:web:ad67fac188b23fe843616d",
  measurementId: "G-9QRP6R3FMG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
