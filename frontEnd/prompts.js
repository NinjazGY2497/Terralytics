import { locationInfo, isLocationInfoNeeded } from './location.js';
import { aiResponse } from "./aiResponse.js";

const buttonGrid = document.querySelectorAll("#buttonGrid button");

buttonGrid.forEach(button => {
  const label = button.nextElementSibling;
  const topic = button.textContent;

  button.addEventListener("click", async function() {
    // Latitude & Longitude (read values at time of click)
    const {lat, long, locationName} = locationInfo;

    // Don't continue if not enough location info
    if (isLocationInfoNeeded()) {
        label.innerHTML = "Please enter or detect your location.";
        return;
    }

    // Add Border
    const parentDiv = button.parentElement;
    parentDiv.style.border = "5px solid #0000002a";

    // AI Prompt
    label.textContent = "Loading AI insights...";

    try {
      const response = await aiResponse(
        `Answer this prompt (ANSWER SHORT!) based on the latLong coordinates, location name, or both:
        - Coordinates: (lat="${lat}", long="${long}")
        - Location Name: "${locationName}"

        Prompt: Info on ${topic} in my area`
      );

      const markdownResponse = response ? marked.parse(response) : '';
      label.innerHTML = markdownResponse || "No response from Gemini.";

    } catch (error) {
      console.error(error);
      label.textContent = "Error contacting AI.";
    }
  });
});