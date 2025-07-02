import axios from 'axios';

export async function getCityPhoto(cityname) {
  const accessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error('Unsplash API access key is missing.');
    return null;
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: cityname,
        page: 1,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,  // ✅ Use accessKey, not secretKey
      },
    });

    const results = response.data.results;
    if (results && results.length > 0) {
      return results[0].urls.regular;
    } else {
      console.warn('No photo found for:', cityname);
      return null;
    }
  } catch (error) {
    console.error('Error fetching city photo:', error);
    return null;
  }
}

