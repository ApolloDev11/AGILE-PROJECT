from firebase_admin import auth, db
import status as Status
import datetime

def verify(request):
	""" Verifies the user with Firebase and returns their uid """

	if "__session" not in request.cookies:
		raise Status.Unauthorized("No session cookie set")

	token = request.cookies["__session"]

	try:
		decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
	except Exception as e:
		raise Status.Unauthorized(e)
	
	return decoded_token["uid"]


def get_name(uid):
	""" Gets the user name from the databse """
	ref = db.reference(f"/users/{uid}/name")
	return ref.get()


def get_email(uid):
	""" Gets the user email from the databse """
	ref = db.reference(f"/users/{uid}/email")
	return ref.get()

def get_gender(uid):
	""" Gets the user gender from the databse """
	ref = db.reference(f"/users/{uid}/gender")
	return ref.get()


def make_order_from_cart(uid):
	""" Copy cart contents to make an order """
	ref = db.reference(f"/users/{uid}/cart")

	order = db.reference(f"/users/{uid}/orders").push()

	order.child("contents").set(ref.get())
	order.child("date").set(datetime.datetime.now().__str__())
	order.child("delivery-driver").set("Unassigned")
	order.child("status").set("In Progress")

	# Delete cart
	ref.delete()


def get_cart(uid):
	""" Get the cart of the user """
	
	ref = db.reference(f"/users/{uid}/cart")
	cart = ref.get() or {}

	for item_id, item in cart.items():
		if item["type"] == "dish":
			item_ref = db.reference(f"/restaurants/{item['restaurant']}/menus/{item['menu']}/dishes/{item['dish']}")
			item_data = item_ref.get()

			# Add the item data to the cart
			cart[item_id]["type"] = "dish"
			cart[item_id]["name"] = item_data["name"]
			cart[item_id]["image"] = f"restaurants/{item['restaurant']}/menus/{item['menu']}/{item['dish']}/image"
			cart[item_id]["price"] = item_data["price"]
		else:
			# Must be an ingredient
			item_ref = db.reference(f"/restaurants/{item['restaurant']}/ingredients/{item['ingredient']}")
			item_data = item_ref.get()

			cart[item_id]["type"] = "ingredient"
			cart[item_id]["name"] = item_data["name"]
			cart[item_id]["image"] = f"restaurants/{item['restaurant']}/ingredients/{item['ingredient']}/image"
			cart[item_id]["price"] = item_data["price"]

	return cart

def get_all_orders(uid):
	""" Get all order information for a given user """

	orders = db.reference(f"/users/{uid}/orders/").get()

	order_list = []

	if orders == None:
		return order_list

	for order_id, order in orders.items():
		contents = db.reference(f"/users/{uid}/orders/{order_id}/contents").get()

		if contents == None:
			continue
		
		# Do dishes
		for item_id, item in contents.items():
			if item["type"] == "dish":
				dish = db.reference(f"/restaurants/{item['restaurant']}/menus/{item['menu']}/dishes/{item['dish']}").get()

				item["date"] = order["date"]
				item["name"] = dish["name"]
				item["price"] = dish["price"]
				item["user_id"] = uid
				item["order_id"] = order_id
				item["item_id"] = item_id
				item["status"] = order["status"]
				item["driver"] = order["delivery-driver"]
				item["image"] = f"restaurants/{item['restaurant']}/menus/{item['menu']}/{item['dish']}/image"
				
				order_list.append(item)

		for item_id, item in contents.items():
			if item["type"] == "ingredient":
				ingredient = db.reference(f"/restaurants/{item['restaurant']}/ingredients/{item['ingredient']}").get()

				item["name"] = ingredient["name"]
				item["price"] = ingredient["price"]
				item["image"] = f"restaurants/{item['restaurant']}/ingredients/{item['ingredient']}/image"

				order_list.append(item)

	return order_list


def get_all_orders_for_restaurant(id):
	""" Get all the orders for a restaurant """

	users = db.reference("/users").get()

	order_list = []

	for user_id, user in users.items():
		orders = db.reference(f"/users/{user_id}/orders").get()

		if orders == None:
			continue

		for order_id, order in orders.items():
			contents = db.reference(f"/users/{user_id}/orders/{order_id}/contents").get()

	
			if contents == None:
				continue
			

			for_restaurant = False

			# Do dishes
			for item_id, item in contents.items():
				if item["type"] == "dish" and item["restaurant"] == id:
					for_restaurant = True

					dish = db.reference(f"/restaurants/{item['restaurant']}/menus/{item['menu']}/dishes/{item['dish']}").get()

					item["name"] = dish["name"]
					item["price"] = dish["price"]
					item["user_id"] = user_id
					item["order_id"] = order_id
					item["item_id"] = item_id
					item["status"] = order["status"]
					item["driver"] = order["delivery-driver"]
					
					order_list.append(item)


			# Do ingredients
			# If there is a single dish for this restaurant, but maybe the
			#   order has more dishes, then only show the dishes for the 
			#   particular restuarant, but STILL list out ALL the ingredients
			#   in the order. The ingredients are global and are not tied to
			#   a specific restaurant. This sucks
			if for_restaurant:
				for item_id, item in contents.items():
					if item["type"] == "ingredient":
						ingredient = db.reference(f"/restaurants/{item['restaurant']}/ingredients/{item['ingredient']}").get()

						item["name"] = ingredient["name"]
						item["price"] = ingredient["price"]

						order_list.append(item)

	return order_list
