import { aiResponse } from "./aiResponse.js";

const detectedLatLabel = document.querySelector("#detectedLatLabel")
const detectedLongLabel = document.querySelector("#detectedLongLabel")
const detectLocationButton = document.querySelector("#detectLocationButton")

const latInput = document.querySelector("#latInput")
const longInput = document.querySelector("#longInput")
const locationNameInput = document.querySelector("#locationNameInput")
const submitButton = document.querySelector("#submitButton")

const buttonGrid = document.querySelector("#buttonGrid")

let locationInfo = {
    lat: undefined,
    long: undefined,
    locationName: undefined
};
export { locationInfo };

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
    locationInfo.lat = position.coords.latitude;
    locationInfo.long = position.coords.longitude;

    detectedLatLabel.textContent = `Latitude: ${locationInfo.lat}`;
    detectedLongLabel.textContent = `Longitude: ${locationInfo.long}`;

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
    locationInfo.lat = latInput.value;
    locationInfo.long = longInput.value;
    locationInfo.locationName = locationNameInput.value;
    
    showButtonGrid();
    promptYourLocation();
})

function isLatLongBlank() {
    const {lat, long} = locationInfo;
    return lat == null || lat === '' || long == null || long === '';
}

function isLocationNameBlank() {
    const {locationName} = locationInfo;
    return locationName == null || locationName === '';
}

// Enough Info? (Ex: does system have lat/long or location name?)
function isLocationInfoNeeded() {
    return isLatLongBlank() && isLocationNameBlank();
}
export { isLocationInfoNeeded };

// AI "Your Location" Prompt
async function promptYourLocation() {
    const label = document.querySelector("#yourLocationP");
    const {lat, long, locationName} = locationInfo;

    // Don't continue if not enough location info
    if (isLocationInfoNeeded()) {
        label.innerHTML = "Please enter or detect your location.";
        return;
    }

    // AI Prompt
    label.textContent = "Loading AI insights...";

    try {
        const response = await aiResponse(
            `Remember that this is for a project that will use you for one response only each time the user enters/detects a new latLong/locationName, this is not a chatbot.\
            You also do not need to restate the question. Respond like you are talking to the user.\
            The user is required to input latLong coordinates or a location name, but doesn't have to give both. No need to mention if latLong or locationName isn't provided, only need to if both aren't provided.\
            Here's the location info: (lat="${lat}", long="${long}"), locationName="${locationName}".\
            State the user's location & region based on the latLong coordinates, location name, or both, IN ONE SENTENCE.`
        );

        const markdownResponse = response ? marked.parse(response) : '';
        label.innerHTML = markdownResponse || "No response from Gemini.";

    } catch (error) {
        console.error(error);
        label.textContent = "Error contacting AI.";
    }
}