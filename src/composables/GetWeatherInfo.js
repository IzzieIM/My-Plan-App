// File: /src/api/getWeatherInfo.js
export async function getWeatherInfo(lat, lon) {
  const apiKey = process.env.VUE_APP_WEATHER_API_KEY;
  if (!apiKey) {
    console.error('WeatherAPI key missing');
    return null;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather');
    return await response.json();
  } catch (err) {
    console.error('Error fetching weather:', err);
    return null;
  }
}
