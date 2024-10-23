// Register function
async function register() {
	const name = document.getElementById("name").value;
	const password = document.getElementById("password").value;
	const email = document.getElementById("email").value;

	const button = document.getElementById("login-button");
	button.disabled = true;

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
			button.disabled = false;

			console.error("Error saving data:", error);
			alert(error.message || error);
		}

		alert("Account crated!")
		// Redirect to login page
		document.location.href = "/login"

	} catch(error) {
		button.disabled = false;

		console.error("Error creating user:", error);
		alert(error.message || error);
	}
}


// Login function
async function login() {
	const password = document.getElementById("password").value;
	const email = document.getElementById("email").value;

	const button = document.getElementById("login-button");
	button.disabled = true;

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
		document.cookie = `__session=${accessToken}; expires=${expiryDate.toUTCString()}`;

		// Check if server can verify user
		let verifyResponse = await api("verify");
		if(!verifyResponse.verified) throw verifyResponse.error || "Server unable to verify user";

		// Redirect home
		document.location.href = "/"


	} catch(error) {
		button.disabled = false;

		console.error("Error signing in:", error);
		alert(error.message || error);
	}
}

// Delete Account function
async function deleteAccount() {

	const user = auth.currentUser;

	if (!user) {
		alert("No user is logged in.");
		return;
	}

	const confirmDelete = confirm("Are you sure you want to delete your account?");
	if(!confirmDelete) return;
	
	try {
		// Delete user data from RTDB
		const database_ref = ref(database, `users/${user.uid}`);
		await remove(database_ref);  

		// Delete the user's authentication account
		await user.delete();

		alert("Account successfully deleted.");
		document.location.href = "/index";  // Bring back to homepage after acc is deleted

	} catch (error) {
		console.error("Error deleting account:", error);
		alert(`Failed to delete account: ${error.message}`);

		// Re-authentication may be required if the user's token has expired.
		if(error.code == "auth/requires-recent-login") {
			alert("Please log in to delete your account.");
			document.location.href = "/login";  // Bring back to login page
		}
	}
}

function logout() {
	document.location.href = "/logout"
}