// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiTxXNz1-7EzDtW8M00_oeU65EaK1miTU",
  authDomain: "claridex-51770.firebaseapp.com",
  databaseURL: "https://claridex-51770-default-rtdb.firebaseio.com",
  projectId: "claridex-51770",
  storageBucket: "claridex-51770.firebasestorage.app",
  messagingSenderId: "1052014400480",
  appId: "1:1052014400480:web:a21f74354a5b00145bd185",
  measurementId: "G-3BCH6VGY70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);