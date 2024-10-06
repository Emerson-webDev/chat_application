// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { collection, getFirestore } = require("@firebase/firestore");
// const { getStorage } = require("firebase/storage");
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
const db = getFirestore(app);
const userCollectionRef = collection(db, "users");
const friendRequestCollectionRef = collection(db, "friendRequest");
const userFriendsCollectionRef = collection(db, "friendsList");
const userNotificationsCollectionRef = collection(db, "notification");

module.exports = { db, userCollectionRef, friendRequestCollectionRef, userFriendsCollectionRef, userNotificationsCollectionRef };
