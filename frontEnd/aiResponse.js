export async function aiResponse(prompt) {
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