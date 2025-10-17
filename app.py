from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import datetime
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
            return jsonify({"error": "Missing token"}), 400

        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        users_collection.update_one(
            {"email": idinfo["email"]},
            {
                "$set": {
                    "name": idinfo["name"],
                    "google_id": idinfo["sub"],
                    "picture": idinfo.get("picture"),
                    "last_login": datetime.datetime.utcnow(),
                }
            },
            upsert=True,
        )

        return jsonify({
            "status": "success",
            "user": {
                "name": idinfo["name"],
                "email": idinfo["email"],
                "picture": idinfo.get("picture")
            }
        }), 200

    except ValueError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return jsonify({"message": "Google Login Backend Running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
