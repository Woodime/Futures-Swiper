// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvhvWpeAPfKYl2i441dlN7knR0VKcyTKU",
  authDomain: "futures-swiper.firebaseapp.com",
  projectId: "futures-swiper",
  storageBucket: "futures-swiper.firebasestorage.app",
  messagingSenderId: "96927756553",
  appId: "1:96927756553:web:b7ce551f03376cd02963d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app); 