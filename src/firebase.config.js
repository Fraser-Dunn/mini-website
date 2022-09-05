import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: "my-minis-site.firebaseapp.com",
  projectId: "my-minis-site",
  storageBucket: "my-minis-site.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGESENDERID,
  appId: process.env.REACT_APP_APPID,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
