from firebase_admin import auth, db
import status as Status

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


def get_cart(uid):
	""" Get the cart of the user """
	
	ref = db.reference(f"/users/{uid}/cart")
	cart = ref.get() or {}

	for item_id, item in cart.items():
		item_ref = db.reference(f"/restaurants/{item['restaurant']}/menus/{item['menu']}/dishes/{item['dish']}")
		item_data = item_ref.get()

		# Add the item data to the cart
		cart[item_id]["name"] = item_data["name"]

	return cart

def get_all_orders(uid):
	""" Get all order information for a given user """

	ref = db.reference(f"/users/{uid}/orders")
	return ref.get()
