from firebase_admin import auth, db
import exception 

def verify(request):
	""" Verifies the user with Firebase and returns their uid """

	if "auth" not in request.cookies:
		raise exception.Unauthorized

	token = request.cookies["auth"]

	try:
		decoded_token = auth.verify_id_token(token, clock_skew_seconds=60)
	except Exception as e:
		raise exception.Unauthorized(e)
	
	return decoded_token["uid"]


def get_name(uid):
	""" Gets the user's ID from the databse """
	ref = db.reference(f"/users/{uid}/name")
	return ref.get()