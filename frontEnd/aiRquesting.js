import { currentCoords } from './location.js';

const buttonGrid = document.querySelectorAll("#buttonGrid button");

buttonGrid.forEach(button => {
  const label = button.nextElementSibling;

  button.addEventListener("click", async () => {
    const topic = button.textContent;

    // Add Border
    const parentDiv = button.parentElement;
    parentDiv.style.border = "5px solid #0000002a";

    // Latitude & Longitude
    const { lat: latitude, long: longitude } = currentCoords; // Read current coordinates at time of click
    
    if (!latitude || !longitude) {
      alert("Please enter or detect your location first.");
      return;
    }

    label.textContent = "Loading AI insights...";

    // Get AI Response
    const flaskServerUrl = "https://hackathoncrewraag.pythonanywhere.com/ai-response"
    const sendingData = {
      prompt: `Here's the Latitude & Longitude coordinates: ${latitude}, ${longitude}. Answer the prompt based on the LatLong coordinates, and answer SIMPLIFIED: Info on ${topic}`
    };

    try {
      const response = await fetch(flaskServerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendingData)
      });

      const receivedData = await response.json();
      label.innerHTML = marked.parse(receivedData.response) || "No response from Gemini."; // Converts Markdown to HTML
    } catch (error) {
      console.error(error);
      label.textContent = "Error contacting AI.";
    }
  });
});
