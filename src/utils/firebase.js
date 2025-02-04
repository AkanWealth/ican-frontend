// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";



export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
