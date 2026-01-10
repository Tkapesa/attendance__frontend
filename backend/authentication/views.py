import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth as firebase_auth
from firebase_config.firebase import FirebaseCredentialsError, get_firestore_db


def _json_error(message, status=400):
    return JsonResponse({"status": "error", "message": message}, status=status)


@csrf_exempt
def login_view(request):
    """
    Verify Firebase ID token from frontend.
    Frontend uses Firebase Auth SDK to sign in, then sends the ID token here.
    """
    if request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return _json_error("Invalid JSON")

    id_token = payload.get("id_token") or payload.get("idToken")
    
    if not id_token:
        return _json_error("id_token is required")

    try:
        # Verify the Firebase ID token
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')
        
        # Get user data from Firestore
        db = get_firestore_db()
        user_doc = db.collection("users").document(uid).get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
        else:
            # Create basic user record if doesn't exist
            user_data = {
                "uid": uid,
                "email": email,
                "role": "teacher",
                "name": email.split("@")[0] if email else "User"
            }
            db.collection("users").document(uid).set(user_data)
        
        return JsonResponse({
            "status": "success",
            "message": "Login successful",
            "user": user_data,
            "token": id_token
        })
        
    except firebase_auth.InvalidIdTokenError:
        return _json_error("Invalid authentication token", status=401)
    except FirebaseCredentialsError as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
    except Exception as e:
        return _json_error(f"Authentication failed: {str(e)}", status=401)


@csrf_exempt
def logout_view(request):
    """Simple logout acknowledgment"""
    return JsonResponse({
        "status": "success",
        "message": "Logged out successfully"
    })


@csrf_exempt
def verify_token(request):
    """Verify if a Firebase ID token is still valid"""
    if request.method != "POST":
        return _json_error("Method not allowed", status=405)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return _json_error("Invalid JSON")

    id_token = payload.get("id_token") or payload.get("idToken")
    
    if not id_token:
        return _json_error("id_token is required")

    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return JsonResponse({
            "status": "success",
            "valid": True,
            "uid": decoded_token['uid']
        })
    except Exception:
        return JsonResponse({
            "status": "error",
            "valid": False,
            "message": "Invalid token"
        }, status=401)
