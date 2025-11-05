from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

client = genai.Client(api_key="<REDACTED_SECRET>")

app = Flask(__name__)

# Sites whitelisted to POST to backend
CORS(app, resources={
    r"/ai-response": {
        "origins": [
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://terralytics.edgeone.app"
        ]
    }
})

@app.route("/ai-response", methods=["POST"])
def getAIResponse():
    promptData = request.get_json()
    model = promptData.get("model", "gemini-2.5-flash") # Default is gemini-2.5-flash
    prompt = promptData.get("prompt")
    print(model, prompt)

    response = client.models.generate_content(
        model=model,
        contents=prompt
    )

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(port="2497")
