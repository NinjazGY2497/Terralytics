from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Gemini API
apiKey = os.getenv("API_KEY")
client = genai.Client(api_key=apiKey)

# Get allowed origins from env file
allowedOriginsStr: str = os.getenv("CORS_ALLOWED_ORIGINS")

ALLOWED_ORIGINS = []
if allowedOriginsStr:
    ALLOWED_ORIGINS = [origin.strip() for origin in allowedOriginsStr.split(',')]

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