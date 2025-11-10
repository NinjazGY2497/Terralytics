import { currentCoords, isLocationInfoNeeded } from './location.js';
import { aiResponse } from "./aiResponse.js";

const buttonGrid = document.querySelectorAll("#buttonGrid button");

buttonGrid.forEach(button => {
  const label = button.nextElementSibling;
  const topic = button.textContent;

  button.addEventListener("click", async function() {
    // Latitude & Longitude (read values at time of click)
    const { lat: latitude, long: longitude } = currentCoords;

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
        `Remember that this is for a project that will use you for one response only each time the user clicks a button, this is not a chatbot.\
        Also remember that the user is already provided with the name of their location, so you do not need to re-specify that.
        Here's the Latitude & Longitude coordinates: lat="${latitude}", long="${longitude}".\
        Answer this prompt based on the LatLong coordinates SIMPLIFIED: Info on ${topic} in my area`
      );

      const markdownResponse = response ? marked.parse(response) : '';
      label.innerHTML = markdownResponse || "No response from Gemini.";

    } catch (error) {
      console.error(error);
      label.textContent = "Error contacting AI.";
    }
  });
});