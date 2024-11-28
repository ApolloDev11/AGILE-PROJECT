// Open restaurant admin page
function openRestaurantAdmin() {
	document.location.href = "/restaurant/admin"
}

// Add dish to cart
async function addToCart(button) {
	let item = button.closest(".dish");
	
	let cartRef = ref(database, `users/${auth.currentUser.uid}/cart`);
	let cart = await get(cartRef);
	if(cart.exists()) cart = cart.val();
	else cart = [];

	let newItemRef = push(cartRef);

	if(cart.length >= 10) return alert("You cannot add more than 10 items to your cart!");
	
	let restaurant = item.getAttribute("data-restaurant");
	let menu = item.getAttribute("data-menu");
	let dish = item.getAttribute("data-dish");

	let name = item.querySelector("h3").innerText;

	// If this item already exists, increase its value
	let existingItem;
	for(let itemID in cart) {
		let item = cart[itemID];
		if(item.restaurant == restaurant && item.menu == menu && item.dish == dish) {
			existingItem = item;
			break;
		}
	}

	if(existingItem) {
		existingItem.amount++;
		set(cartRef, cart);
	} else {
		set(newItemRef, {
			type: "dish",
			restaurant,
			menu,
			dish,
			amount: 1
		});
	}

	if(existingItem) alert(`You now have ${existingItem.amount} ${name}s in your cart!`);
	else alert(`Added ${name} to your cart!`);
}