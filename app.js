// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkoYvz49Xs6vg9-SUHM236plfeN6Dck4s",
  authDomain: "mtu-group-project-agile.firebaseapp.com",
  databaseURL: "https://console.firebase.google.com/u/1/project/mtu-group-project-agile/database/mtu-group-project-agile-default-rtdb/data/~2F",
  projectId: "mtu-group-project-agile",
  storageBucket: "mtu-group-project-agile.appspot.com",
  messagingSenderId: "120193305147",
  appId: "1:120193305147:web:2d3030b6e662d54a67aa1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database services
const auth = getAuth(app);
const database = getDatabase(app);

// Register function
function register() {
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  // Create user with email and password
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);  // Log the user object to verify UID
    
    const database_ref = ref(database, 'users/' + user.uid);
    const user_data = { name: name, password: password, email: email };

    set(database_ref, user_data)
      .then(() => {
        alert('User Created');
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  })
  .catch((error) => {
    console.error("Error creating user:", error);
    alert(error.message);
  });

}
