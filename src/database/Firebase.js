import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjJx9MTX6PWjYD2gTjjs-LzJFCPGQVExE",
  authDomain: "balance-express.firebaseapp.com",
  projectId: "balance-express",
  storageBucket: "balance-express.appspot.com",
  messagingSenderId: "667385635480",
  appId: "1:667385635480:web:875df46ea89fa9effda6ed",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default {
  firebase,
  db,
};
