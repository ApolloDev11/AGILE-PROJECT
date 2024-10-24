async function closeRestaurant() {
	if(!confirm("Permanently delete your restaurant?")) return;
	
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	
	try {
		// Set restaurant to empty object in database
		const restaurantRef = ref(database, `restaurants/${restaurantID}`);
		await set(restaurantRef, {})

	} catch(error) {
		return alert(error || error.message)
	}

	// Redirect to home page
	document.location.href = "/";
}

function editRestaurantDetails() {
	document.location.href = "/restaurant/admin/details";
}