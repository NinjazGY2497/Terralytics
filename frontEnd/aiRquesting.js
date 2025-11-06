import { currentCoords } from './location.js';

const buttonGrid = document.querySelectorAll("#buttonGrid button");

buttonGrid.forEach(button => {
  const label = button.nextElementSibling;
  const topic = button.textContent;

  button.addEventListener("click", async function() {
    // Add Border
    const parentDiv = button.parentElement;
    parentDiv.style.border = "5px solid #0000002a";

    // Latitude & Longitude (read values at time of click)
    const { lat: latitude, long: longitude } = currentCoords;

    // Accept 0 as valid coordinate; only reject undefined/null/empty string
    if (latitude == null || longitude == null || latitude === '' || longitude === '') {
      alert("Please enter or detect your location first.");
      return;
    }

    // AI
    label.textContent = "Loading AI insights...";

    try {
      const response = await aiResponse(
        `Here's the Latitude & Longitude coordinates: lat=${latitude}, long=${longitude}.
         Answer this prompt based on the LatLong coordinates SIMPLIFIED: Info on ${topic}`
      );

      const markdownResponse = response ? marked.parse(response) : '';
      label.innerHTML = markdownResponse || "No response from Gemini.";
    } catch (error) {
      console.error(error);
      label.textContent = "Error contacting AI.";
    }
  });
});

async function aiResponse(prompt) {
  const flaskServerUrl = "http://127.0.0.1:2497/ai-response";
  const sendingData = {
    prompt: prompt
  };

  try {
    const response = await fetch(flaskServerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendingData)
    });
    const receivedData = await response.json();

    return receivedData.response;

  } catch (error) {
    console.error(error);
    return "Error contacting AI.";
  }
}