// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpeIiYt3BSKBrhRAOf11_FzNf55AFgPZ0",
  authDomain: "programacao-movel-tarde.firebaseapp.com",
  projectId: "programacao-movel-tarde",
  storageBucket: "programacao-movel-tarde.appspot.com",
  messagingSenderId: "727603664468",
  appId: "1:727603664468:web:663e3c4435600dce34bfc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db }