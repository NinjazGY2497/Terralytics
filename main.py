from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS

client = genai.Client(api_key="<REDACTED_SECRET>")

app = Flask(__name__)

# Configure Flask server to accept requests from development origin
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
    latLong = promptData.get("latLong")
    prompt = promptData.get("prompt")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Here's the Latitude & Longitude coordinates: {latLong}. Answer the prompt based on the LatLong coordinates, and answer SIMPLIFIED: Info on {prompt}"
    )

    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(port="2497")