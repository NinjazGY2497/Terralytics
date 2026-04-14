from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

# Groq API
try:
    GROQ_KEY = os.getenv("GROQ_KEY")
    client = Groq(api_key=GROQ_KEY)
except Exception:
    print(f"**main.py** - ERROR - Failed to initialize Groq API client.")
    raise

# CORS allowed origins
ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500", "https://terralytics.edgeone.app", "https://terralytics-beta.edgeone.app"] # Don't keep localhost urls in production

app = Flask(__name__)

# Whitelist sites specified
CORS(app, resources={r"/ai-response": {"origins": ALLOWED_ORIGINS}})

def requestGroq(userPrompt):
    SYSTEM_PROMPT = ("You are a specialized Geological Data Engine. Your role is to provide simplified, highly accurate information about geology and rocks based on geographic data.\n\n"
                    "RULES:\n"
                    "1. RESPONSE FORMAT: Markdown, but don't use tables. Never include introductory text, conversational filler, or concluding remarks.\n"
                    "2. MISSING DATA: The user is required to input latLong coordinates or a location name, but doesn't have to give both. No need to mention if latLong or locationName is blank, only need to if both are blank.\n"
                    "3. Keep your responses short and simplified")

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            temperature=0.2,
            max_completion_tokens=350,
            reasoning_effort="low"
        )
        response = completion.choices[0].message.content
        print(f"**main.py** - INFO - Groq Response: {response}")
        return response
    
    except Exception:
        print(f"**main.py** - ERROR - Failed to get response from Groq API.")
        raise

@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    try:
        promptData = request.get_json()
        prompt = promptData.get("prompt")
        print(f"**main.py** - INFO - Prompt Data: {promptData}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to parse request JSON: {promptData}")
        raise

    try:
        response = requestGroq(prompt)
        print(f"**main.py** - INFO - Groq Response: {response}")
    except Exception:
        print(f"**main.py** - ERROR - Failed to get response from Groq API.")
        raise

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port="2497")