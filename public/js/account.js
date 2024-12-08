

// Register function
async function register() {
	const name = document.getElementById("name").value;
	const password = document.getElementById("password").value;
	const email = document.getElementById("email").value;
	// const isOwner = document.getElementById("is-owner").checked;
	const isOwner = false;
	const gender = document.querySelector('input[name="gender"]:checked')?.value; 
	const hasDisabilities = document.getElementById("has-disabilities").checked; 

	

	const button = document.getElementById("login-button");
	button.disabled = true;

	let address = " ";
	let phone = 0;
	if(isOwner){
		address = document.getElementById("address").value;
		phone = document.getElementById("phone").value;
	}

	// Create user with email and password
	try {
		const credential = await createUserWithEmailAndPassword(auth, email, password);
		const user = credential.user;
		console.log(user);  // Log the user object to verify UID
		
		const database_ref = ref(database, `users/${user.uid}`);
		const user_data = {name, email, isOwner,gender,hasDisabilities};

		if(isOwner){
			user_data.address = address;
			user_data.phone = phone;
		}

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

// Change/reset password
function resetPassword(email) {
	try {
		sendPasswordResetEmail(auth, email || auth.currentUser.email)
		alert("A password reset link has been sent to your email")

	} catch(error) {
		return alert(error.message || error)
	}
}

function logout() {
	document.location.href = "/logout"
}


// Edit Acount Details
function toggleEditForm() {
    const editForm = document.getElementById("edit-account-form");
    editForm.style.display = editForm.style.display === "none" ? "block" : "none";
}

async function saveChanges() {
    const user = auth.currentUser;

    if (!user) {
        alert("No user is logged in.");
        return;
    }

    const updatedName = document.getElementById("edit-name").value;
    const updatedEmail = document.getElementById("edit-email").value;
    let updatedAddress = null;
    let updatedPhone = null;


    if (user.manages_restaurant) {
        updatedAddress = document.getElementById("edit-address").value;
        updatedPhone = document.getElementById("edit-phone").value;
    }

    try {
    
        const database_ref = ref(database, `users/${user.uid}`);
		const database_data = database_ref.get();
        const user_data = { name: updatedName, email: updatedEmail };

        if (user.manages_restaurant) {
            user_data.address = updatedAddress;
            user_data.phone = updatedPhone;
        }

        await set(database_ref, user_data);
        alert("Account details updated successfully!");

		updateEmail(auth.currentUser, updatedEmail)
    
        const nameParagraph = document.querySelector("p:nth-of-type(1)");
        const emailParagraph = document.querySelector("p:nth-of-type(2)"); 
        nameParagraph.innerHTML = `<b>Name:</b> ${updatedName}`; 
        emailParagraph.innerHTML = `<b>Email:</b> ${updatedEmail}`; 

        toggleEditForm();

    } catch (error) {
        console.error("Error updating user data:", error);
        alert(`Failed to update account: ${error.message}`);
    }
}


document.getElementById("save-changes-btn").addEventListener("click", saveChanges);
document.getElementById("cancel-edit-btn").addEventListener("click", toggleEditForm);
