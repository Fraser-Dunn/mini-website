import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9mJLsIsyJTRtQy7EwnxqoL-gBXDa1pxg",
  authDomain: "my-minis-site.firebaseapp.com",
  projectId: "my-minis-site",
  storageBucket: "my-minis-site.appspot.com",
  messagingSenderId: "294752755431",
  appId: "1:294752755431:web:ec3b79f135af3eda694c42",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
