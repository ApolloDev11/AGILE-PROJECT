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

	if(cart.some(e => e.name == name)) alert("Warning: You have already added this item to your cart!");

	cart.push({
		type: "dish",
		name,
		cost,
		icon,
		amount: 1
	});

	set(cartRef, cart);

	alert(`Added ${name} to your cart!`);
}