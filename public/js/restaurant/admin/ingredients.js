async function addIngredient() {
    const ingredientName = document.getElementById("ingredient-title-input");

    // Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;

    let ingredient = {name: ingredientName.value};
    let ingredientRef = ref(database, `/restaurants/${restaurantID}/ingredients`);

    let newIngredients = push(ingredientRef);

    try{
        let ingredientsSnap = await get(ingredientRef);

        const price = Number(document.getElementById("ingredient-price-input").value);
		if(isNaN(price) || price < 0) throw "No ingredient price provided";


        // Get image for new ingredient
		if(document.getElementById("ingredient-image-input").files == 0) throw "No image selected!";
		const file = document.getElementById("ingredient-image-input").files[0];
		// Ensure image is less than 2MB in size
		if(Number(file.size.toString()) > 2 * 1024 * 1024) throw "Image must be less than 2MB in size";

		// Ensure image is 250×250 or larger
		await validateImage(file);

		// Upload image to Firebase
		let imageRef = storageRef(storage, `/restaurants/${restaurantID}/ingredients/${newIngredients.key}/image`);
		await uploadBytes(imageRef, file);
        
        await set(newIngredients, {name: ingredientName.value, price});
        console.log("Ingredient added:", ingredient);
        document.location.reload();

    }catch (error) {
        alert(error.message || error)
		console.error(error)
    }
}

async function deleteIngredient(ingredientId) {

    const restaurantID = auth.currentUser.uid;
    
    let ingredientRef = ref(database, `/restaurants/${restaurantID}/ingredients/${ingredientId}`);
    

    try {
		await remove(ingredientRef);
	} catch(error) {
		alert(error.message || error)
		console.error(error)
	}
    document.location.reload();
}
