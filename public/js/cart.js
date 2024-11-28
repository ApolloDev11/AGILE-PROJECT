async function removeFromCart(itemID) {
	let itemRef = ref(database, `users/${auth.currentUser.uid}/cart/${itemID}`);
	
	remove(itemRef);
	document.location.reload();
}

async function incrementDish(itemID) {
	let amountRef = ref(database, `users/${auth.currentUser.uid}/cart/${itemID}/amount`);

	let amount = (await get(amountRef)).val() || 0;
	amount += 1;

	set(amountRef, amount);
	document.location.reload();
}

async function decrementDish(itemID) {
	let amountRef = ref(database, `users/${auth.currentUser.uid}/cart/${itemID}/amount`);

	let amount = (await get(amountRef)).val() || 0;
	amount -= 1;

	if(amount <= 0) return;
	set(amountRef, amount);
	document.location.reload();
}

function finaliseOrder() {
	document.location.href = "/order"
}