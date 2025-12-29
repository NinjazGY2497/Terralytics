from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API
try:
    apiKey = os.getenv("API_KEY")
    client = genai.Client(api_key=apiKey)
except Exception:
    print(f"**main.py** - ERROR - Failed to initialize Gemini API client.")
    raise

# CORS allowed origins
ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500", "https://terralytics.edgeone.app", "https://terralytics-beta.edgeone.app"] # Don't keep localhost urls in production

app = Flask(__name__)

# Whitelist sites specified
CORS(app, resources={r"/ai-response": {"origins": ALLOWED_ORIGINS}})

@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    try:
        promptData = request.get_json()
        model = promptData.get("model", "gemini-2.5-flash") # Default is gemini-2.5-flash
        prompt = promptData.get("prompt")
        print(f"**main.py** - INFO - Prompt Data: {promptData}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to parse request JSON: {promptData}")
        raise

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        print(f"**main.py** - INFO - AI Response: {response.text}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to get response from Gemini API.")
        raise

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(port="2497")