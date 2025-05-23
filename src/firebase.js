import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrmseV9j1Fb6eX8ERwbdPHJs2u8BhyCHM",
  authDomain: "react-lab-4738d.firebaseapp.com",
  projectId: "react-lab-4738d",
  storageBucket: "react-lab-4738d.appspot.com",
  messagingSenderId: "247888080612",
  appId: "1:247888080612:web:4eedd8fc3a40c2d70046f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
sdffffffffffffffffffffffffff