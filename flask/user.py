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


def make_order_from_cart(uid):
	""" Copy cart contents to make an order """
	ref = db.reference(f"/users/{uid}/cart")

	order = db.reference(f"/users/{uid}/orders").push()

	order.child("contents").set(ref.get())
	order.child("date").set(datetime.datetime.now().__str__())
	order.child("delivery-driver").set("Unassigned")
	order.child("status").set("In Progress")


def make_order_from_cart(uid):
	""" Delete users cart """
	ref = db.reference(f"/users/{uid}/cart")
	ref.delete()
