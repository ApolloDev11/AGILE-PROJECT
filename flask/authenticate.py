from firebase_admin import auth
import exception 

def verify_user(request):
	"""Verifies the user with Firebase and returns their uid"""

	if "auth" not in request.cookies:
		raise exception.Unauthorized

	token = request.cookies["auth"]

	try:
		decoded_token = auth.verify_id_token(token)
	except:
		raise exception.Unauthorized
	
	return decoded_token["uid"]