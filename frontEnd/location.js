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

// Location Funcs
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
}

detectLocationButton.addEventListener("click", function() {
    getLocation();
    showButtonGrid();
});

submitButton.addEventListener("click", function() {
    currentCoords.lat = latInput.value;
    currentCoords.long = longInput.value;
    
    showButtonGrid();
})
