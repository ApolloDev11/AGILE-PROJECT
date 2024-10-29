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
		console.error(error)
	}

	// Redirect to home page
	document.location.href = "/";
}

function editRestaurantDetails() {
	document.location.href = "/restaurant/admin/details";
}

function openRestaurantPage() {
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;

	document.location.href = `/restaurant/${restaurantID}`;
}

async function addMenu() {
	document.getElementById("add-menu-button").disabled = true;
	
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	// Get next menu index
	const menuIndex = document.querySelectorAll(".menu")?.length || 0

	try {
		// Get title of new menu
		const title = document.getElementById("menu-title-input").value;
		if(!title) throw "Menu Title is empty!";

		// Get image for new menu
		if(document.getElementById("menu-image-input").files == 0) throw "No image selected!";
		const file = document.getElementById("menu-image-input").files[0];
		// Ensure image is less than 2MB in size
		if(Number(file.size.toString()) > 2 * 1024 * 1024) throw "Image must be less than 2MB in size";

		// Ensure image is 250×250 or larger
		await validateImage(file);

		// Upload image to Firebase
		let imageRef = storageRef(storage, `/restaurants/${restaurantID}/menus/${menuIndex}/image`);
		await uploadBytes(imageRef, file);

		// Save menu data to Firebase
		let menuDataRef = ref(database, `/restaurants/${restaurantID}/menus/${menuIndex}`)
		set(menuDataRef, {name: title});

		// Refresh page to see new menu
		location.reload();
	} catch(error) {
		document.getElementById("add-menu-button").disabled = false;
		alert(error.message || error)
		console.error(error)
	}
}

async function deleteMenu(button) {
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	
	// Get menu based on clicked button
	const menu = button.closest(".menu");
	const menuTitle = menu.querySelector(".menu-title").textContent;
	const menuIndex = menu.dataset.menuIndex;

	// Show confirmation message
	if(!confirm(`Are you sure you want to delete menu "${menuTitle}" and all of its dishes?`)) return;

	// Remove menu
	try {
		let menuRef = ref(database, `/restaurants/${restaurantID}/menus/${menuIndex}`);
		await remove(menuRef);
	} catch(error) {
		alert(error.message || error)
		console.error(error)
	}

	// Refresh page
	location.reload();
};