import { sleep } from "/js/common.js"
import {
	auth,
	database,
	ref,
	set,
	get,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from "/js/firebase.js";


// Register function
export async function register() {
	const name = document.getElementById('name').value;
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;

	// Create user with email and password
	try {
		const credential = await createUserWithEmailAndPassword(auth, email, password);
		const user = credential.user;
		console.log(user);  // Log the user object to verify UID
		
		const database_ref = ref(database, `users/${user.uid}`);
		const user_data = {name, email};

		try {
			await set(database_ref, user_data)

		} catch(error) {
			console.error("Error saving data:", error);
			alert(error.message);
		}

		alert("Account crated!")
		// Redirect to login page
		document.location.href = "/login"

	} catch(error) {
		console.error("Error creating user:", error);
		alert(error.message);
	}
}


// Login function
export async function login() {
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;

	// Create user with email and password
	try {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		const user = credential.user;
		console.log(user);  // Log the user object to verify UID

		// Save access token to be accessed by server
		const accessToken = await user.getIdToken();
		// Expiry date one month from now
		let expiryDate = new Date();
		expiryDate.setMonth(expiryDate.getMonth() + 1);
		document.cookie = `auth=${accessToken}; expires=${expiryDate.toUTCString()}`;

		// Wait for a bit after setting cookie
		await sleep(500)

		// Redirect home
		document.location.reload();


	} catch(error) {
		console.error("Error signing in:", error);
		alert(error.message);
	}

}
