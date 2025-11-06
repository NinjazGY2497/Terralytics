export async function aiResponse(prompt) {
  const flaskServerUrl = "https://hackathonCrewRAAG.pythonanywhere.com/aiResponse"; // Flask Server URL: https://hackathonCrewRAAG.pythonanywhere.com/aiResponse
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