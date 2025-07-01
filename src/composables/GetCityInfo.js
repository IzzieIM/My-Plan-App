import axios from 'axios';

// Use the correct env variable for Vue CLI
const RAPID_API_KEY = process.env.VUE_APP_RAPID_API_KEY;

export async function getCityInfo(cityName) {
  if (!RAPID_API_KEY) {
    console.error('RapidAPI key is missing. Please set VUE_APP_RAPID_API_KEY in your .env file.');
    return null;
  }
  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: { namePrefix: cityName, limit: 1 },
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    const city = response.data.data[0];
    if (!city) {
      throw new Error('City not found');
    }
    return {
      name: city.name,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
    };
  } catch (error) {
    console.error('Error fetching city info:', error);
    return null;
  }
}