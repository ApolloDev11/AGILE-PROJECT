async function saveRestaurantDetails() {
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
		await set(restaurantRef, restaurantData)

		// Get the file, throw error if no file selected
		const file = document.getElementById("restaurant-image").files[0];
		if(!file) throw "No image selected";

		// Upload the image to Firebase storage
		const imageRef = storageRef(storage, `restaurants/${restaurantID}/image`);
		await uploadBytes(imageRef, file, {contentType: file.type});

		// Redirect user to restaurant list
		document.location.href = `/restaurant/${restaurantID}`;

	} catch(error) {
		document.querySelector("form button").disabled = false;

		alert(error.message || error);
		console.error(error)
	}
}