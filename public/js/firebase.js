// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'

import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkoYvz49Xs6vg9-SUHM236plfeN6Dck4s",
  authDomain: "mtu-group-project-agile.firebaseapp.com",
  databaseURL: "ttps://mtu-group-project-agile-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mtu-group-project-agile",
  storageBucket: "mtu-group-project-agile.appspot.com",
  messagingSenderId: "120193305147",
  appId: "1:120193305147:web:2d3030b6e662d54a67aa1e"
};

export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database services
export const auth = getAuth(app);
export const database = getDatabase(app);

export { ref, set, get, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged }