import logging
from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

import os
from dotenv import load_dotenv

# Logging configuration
scriptDir = os.path.dirname(os.path.abspath(__file__))
logFilename = os.path.join(scriptDir, "app.log")
logging.basicConfig(level=logging.INFO, filename=logFilename, filemode="w", format="%(asctime)s - %(levelname)s - %(message)s")
load_dotenv()

# Gemini API
try:
    apiKey = os.getenv("API_KEY")
    client = genai.Client(api_key=apiKey)
except Exception:
    logging.exception("Failed to initialize Gemini API client.")
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
        logging.info("Prompt Data: %s", promptData)
    except Exception:
        logging.exception(f"Failed to parse request JSON: {promptData}")
        raise

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        logging.info("AI Response: %s", response.text)
    except Exception:
        logging.exception("Failed to get response from Gemini API.")
        raise

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(port="2497")