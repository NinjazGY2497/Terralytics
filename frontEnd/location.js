import { aiResponse } from "./aiResponse.js";

const detectedLatLabel = document.querySelector("#detectedLatLabel")
const detectedLongLabel = document.querySelector("#detectedLongLabel")
const detectLocationButton = document.querySelector("#detectLocationButton")

const latInput = document.querySelector("#latInput")
const longInput = document.querySelector("#longInput")
const submitButton = document.querySelector("#submitButton")

const buttonGrid = document.querySelector("#buttonGrid")

let currentCoords = {
    lat: undefined,
    long: undefined
};
export { currentCoords };

// Show Grid
function showButtonGrid() {
    buttonGrid.style.display = "flex";
}

// Detect Location Funcs
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function showPosition(position) {
    currentCoords.lat = position.coords.latitude;
    currentCoords.long = position.coords.longitude;

    detectedLatLabel.textContent = `Latitude: ${currentCoords.lat}`;
    detectedLongLabel.textContent = `Longitude: ${currentCoords.long}`;

    promptYourLocation();
}

function showError(error) {
    console.log(error);

    let errorResponse;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorResponse = "You denied the request for Geolocation"
            break;
        case error.POSITION_UNAVAILABLE:
            errorResponse = "Location info is unavailable"
            break;
        case error.TIMEOUT:
            errorResponse = "The request to enable location permissions timed out"
            break;
        case error.UNKNOWN_ERROR:
            errorResponse = "An unknown error occurred"
            break;
        default:
            errorResponse = "An unknown error occurred"
    }

    alert(errorResponse);
    promptYourLocation();
}

// Event Listeners
detectLocationButton.addEventListener("click", function() {
    getLocation();
    showButtonGrid();
});

submitButton.addEventListener("click", function() {
    currentCoords.lat = latInput.value;
    currentCoords.long = longInput.value;
    
    showButtonGrid();
    promptYourLocation();
})

// AI "Your Location" Prompt
async function promptYourLocation() {
    const label = document.querySelector("#yourLocationP");
    const {lat: lat, long: long} = currentCoords;

    // Accept 0 as valid coordinate; only reject undefined/null/empty string
    if (lat == null || long == null || lat === '' || long === '') {
      label.innerHTML = "Please enter or detect your location.";
      return;
    }

    // AI Prompt
    label.textContent = "Loading AI insights...";

    try {
        const response = await aiResponse(
        `Remember that this is for a project that will use you for one response only each time the user enters/detects a new latLong/location, this is not a chatbot.\
        You also do not need to restate the question. Respond like you are talking to the user.\
        Here's the Latitude & Longitude coordinates: lat="${lat}", long="${long}".\
        State the user's location & region based on the LatLong coordinates IN ONE SENTENCE.`
        );

        const markdownResponse = response ? marked.parse(response) : '';
        label.innerHTML = markdownResponse || "No response from Gemini.";

    } catch (error) {
        console.error(error);
        label.textContent = "Error contacting AI.";
    }
}