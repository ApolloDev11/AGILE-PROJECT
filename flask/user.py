from firebase_admin import auth, db
import exception 

def verify(request):
	""" Verifies the user with Firebase and returns their uid """

	if "auth" not in request.cookies:
		raise exception.Unauthorized("No auth cookie set")

	token = request.cookies["auth"]

	try:
		decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
	except Exception as e:
		raise exception.Unauthorized(e)
	
	return decoded_token["uid"]


def get_name(uid):
	""" Gets the user name from the databse """
	ref = db.reference(f"/users/{uid}/name")
	return ref.get()


def get_email(uid):
	""" Gets the user email from the databse """
	ref = db.reference(f"/users/{uid}/email")
	return ref.get()