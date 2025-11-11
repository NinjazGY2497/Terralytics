from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API
apiKey = os.getenv("API_KEY")
client = genai.Client(api_key=apiKey)

# CORS allowed origins
ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500", "https://terralytics.edgeone.app", "https://terralytics-beta.edgeone.app"] # Don't keep localhost urls in production

app = Flask(__name__)

# Whitelist sites specified
CORS(app, resources={r"/ai-response": {"origins": ALLOWED_ORIGINS}})

@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    promptData = request.get_json()
    model = promptData.get("model", "gemini-2.5-flash") # Default is gemini-2.5-flash
    prompt = promptData.get("prompt")
    print("INFO: Prompt Data:", promptData)

    response = client.models.generate_content(
        model=model,
        contents=prompt
    )
    print("INFO: AI Response:", response.text)

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(port="2497")