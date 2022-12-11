// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdQ9gfc1xlL_GZ8OMccukJOUn0wEhnFzc",
  authDomain: "imager-f9e88.firebaseapp.com",
  projectId: "imager-f9e88",
  storageBucket: "imager-f9e88.appspot.com",
  messagingSenderId: "770174664597",
  appId: "1:770174664597:web:85eec371cd6baf7a51c09c",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

export { db, auth, googleProvider, gitHubProvider };
