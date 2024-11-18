// Open restaurant admin page
function openRestaurantAdmin() {
	document.location.href = "/restaurant/admin"
}

// Add dish to cart
async function addToCart(item) {
	const cartRef = ref(database, `users/${auth.currentUser.uid}/cart`);
	let cart = await get(cartRef);
	if(cart.exists()) cart = cart.val();
	else cart = [];

	if(cart.length == 10) return alert("You cannot add more than 10 items to your cart!");

	item = item.closest(".dish");
	const name = item.querySelector("h3").innerText;
	const icon = item.querySelector("img").src;
	let cost = item.querySelector("p").innerText;
	cost = Number(cost.replace("€", ""));

	// If this item already exists, increase its value
	let existingItem = cart.find(e => e.name == name);
	if(existingItem) existingItem.amount++;
	else {
		cart.push({
			type: "dish",
			name,
			cost,
			icon,
			amount: 1
		});
	}

	set(cartRef, cart);

	if(existingItem) alert(`You now have ${amount} ${name}s in your cart!`);
	else alert(`Added ${name} to your cart!`);
}