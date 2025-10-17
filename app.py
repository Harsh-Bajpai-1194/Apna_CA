from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

app = Flask(__name__)
CORS(app)

# --- Google OAuth Config ---
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "362952582119-n3pib5i1qe57tvv9ksh574uoo9rnf0cf.apps.googleusercontent.com")

# --- Route for Google Sign-In ---
@app.route("/tokensignin", methods=["POST"])
def token_signin():
    try:
        token = request.json.get("id_token")
        if not token:
            return jsonify({"error": "Missing ID token"}), 400

        # Verify the token with Google. This is the core authentication step.
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        # Token is valid, so we can send user info back to the client.
        # No database interaction happens here.
        return jsonify({
            "status": "success",
            "user": {
                "name": idinfo["name"],
                "email": idinfo["email"],
                "picture": idinfo.get("picture"),
                "google_id": idinfo["sub"] # The user's unique Google ID
            }
        }), 200

    except ValueError:
        # This error is raised when the token is invalid (e.g., expired, wrong audience)
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        print(f"An error occurred: {e}") # Log the error for debugging
        return jsonify({"error": "An internal server error occurred"}), 500


@app.route("/")
def home():
    return jsonify({"message": "Google Login Backend Running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)