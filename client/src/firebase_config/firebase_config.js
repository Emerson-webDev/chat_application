// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { collection, getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db =  getFirestore(app)
export const storage = getStorage();
export const auth = getAuth();
export const userCollectionRef = collection(db,"users")
export const userChatCollectionRef = collection(db,"usersChat")
export const chatCollectionRef = collection(db,"chat")
export const videoCallCollectionRef = collection(db,"videoCall")
export const friendRequestCollectionRef = collection(db,"friendRequest")
export const userFriendsCollectionRef = collection(db,"friendsList")
export const userNotificationsCollectionRef = collection(db,"notification")
