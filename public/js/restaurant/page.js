// Add dish to cart
async function addToCart(button) {
	let item = button.closest(".dish");
	
	var type = "dish";

	if (item.classList.contains("ingredient"))
		type = "ingredient";

	let cartRef = ref(database, `users/${auth.currentUser.uid}/cart`);
	let cart = await get(cartRef);
	if(cart.exists()) cart = cart.val();
	else cart = [];

	let newItemRef = push(cartRef);

	if(cart.length >= 10) return alert("You cannot add more than 10 items to your cart!");
	
	let name = item.querySelector("h3").innerText;
	
	let existingItem;

	if (type == "dish") {
		let restaurant = item.getAttribute("data-restaurant");
		let menu = item.getAttribute("data-menu");
		let dish = item.getAttribute("data-dish");

		// If this item already exists, increase its value
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
				type,
				restaurant,
				menu,
				dish,
				amount: 1
			});
		}
	} else {
		let restaurant = item.getAttribute("data-restaurant");
		let ingredient = item.getAttribute("data-ingredient");


		// If this item already exists, increase its value
		for(let itemID in cart) {
			let item = cart[itemID];
			if(item.restaurant == restaurant && item.ingredient == ingredient) {
				existingItem = item;
				break;
			}
		}

		if(existingItem) {
			existingItem.amount++;
			set(cartRef, cart);
		} else {
			set(newItemRef, {
				type,
				restaurant,
				ingredient,
				amount: 1
			});
		}
	}

	if(existingItem) alert(`You now have ${existingItem.amount} ${name}s in your cart!`);
	else alert(`Added ${name} to your cart!`);
}