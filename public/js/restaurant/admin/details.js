async function saveRestaurantDetails(imageRequired=false) {
	try {
		document.querySelector("form button").disabled = true;
		
		// Use uid as restaurant ID
		const restaurantID = auth.currentUser.uid;

		// Gather all restaurant data from form
		const restaurantData = {
			name: document.getElementById("restaurant-name").value,
			phone: document.getElementById("restaurant-phone").value,
			address: document.getElementById("restaurant-address").value,
			email: document.getElementById("restaurant-email").value
		}

		// Save restaurant data to database
		const restaurantRef = ref(database, `restaurants/${restaurantID}`);
		await update(restaurantRef, restaurantData)

		// Get the file, throw error if image required and no file selected
		const file = document.getElementById("restaurant-image").files[0];
		if(imageRequired && !file) throw "No image selected";

		if(file) {
			// Upload the image to Firebase storage
			const imageRef = storageRef(storage, `restaurants/${restaurantID}/image`);
			await uploadBytes(imageRef, file, {contentType: file.type});
		}

		// Redirect user to restaurant list
		document.location.href = `/restaurant/${restaurantID}`;

	} catch(error) {
		document.querySelector("form button").disabled = false;

		alert(error.message || error);
		console.error(error)
	}
}