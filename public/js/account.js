import { sleep, api } from "/js/common.js"
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

	document.getElementById("progress").hidden = true;

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
			document.getElementById("progress").hidden = false;

			console.error("Error saving data:", error);
			alert(error.message || error);
		}

		alert("Account crated!")
		// Redirect to login page
		document.location.href = "/login"

	} catch(error) {
		document.getElementById("progress").hidden = false;

		console.error("Error creating user:", error);
		alert(error.message || error);
	}
}


// Login function
export async function login() {
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;

	document.getElementById("progress").hidden = false;

	// Create user with email and password
	try {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		const user = credential.user;
		console.log(user);  // Log the user object to verify UID

		// Save access token to be accessed by server
		const accessToken = await user.getIdToken(true);
		// Expiry date one month from now
		let expiryDate = new Date();
		expiryDate.setMonth(expiryDate.getMonth() + 1);
		document.cookie = `auth=${accessToken}; expires=${expiryDate.toUTCString()}`;

		// Wait until server can verify user
		let n = 0;
		while(true) {
			let verifyResponse = await api("verify");
			if(verifyResponse.verified) break
			if(n++ > 10) throw verifyResponse.error || "Server unable to verify user";
			await sleep(500)
		}

		// Redirect home
		document.location.reload();


	} catch(error) {
		document.getElementById("progress").hidden = true;

		console.error("Error signing in:", error);
		alert(error.message || error);
	}
}

// Delete Account function
export async function deleteAccount() {

    const user = auth.currentUser;

    if (!user) {
        alert("No user is logged in.");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete your account?");
    
    if (confirmDelete) {
        try {
            // Delete user data from RTDB
            const database_ref = ref(database, `users/${user.uid}`);
            await remove(database_ref);  

            // Delete the user's authentication account
            await user.delete();

            alert("Account successfully deleted.");
            document.location.href = '/index';  // Bring back to homepage after acc is deleted

        } catch (error) {
            console.error("Error deleting account:", error);
            alert(`Failed to delete account: ${error.message}`);

            // Re-authentication may be required if the user's token has expired.
            if (error.code === 'auth/requires-recent-login') {
                alert("Please log in to delete your account.");
                document.location.href = '/login';  // Bring back to login page
            }
        }
    }
}


export function logout() {
	document.location.href = "/logout"
}