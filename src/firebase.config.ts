import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "my-minis-site.firebaseapp.com",
  projectId: "my-minis-site",
  storageBucket: "my-minis-site.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGESENDERID,
  appId: import.meta.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// getAuth()/getStorage() validate the API key and throw synchronously, so
// they're deferred to first use (not called at module load) to avoid
// crashing the whole app before it can mount if Firebase config is bad.
let authInstance: Auth | undefined;
export const getFirebaseAuth = (): Auth => {
  authInstance ??= getAuth(app);
  return authInstance;
};

let storageInstance: FirebaseStorage | undefined;
export const getFirebaseStorage = (): FirebaseStorage => {
  storageInstance ??= getStorage(app);
  return storageInstance;
};
