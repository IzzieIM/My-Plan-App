<template>
  <div class="container py-4">
    <div class="mb-3">
      <input v-model="searchQuery" class="form-control" placeholder="Enter city name" @keyup.enter="searchCity" />
    </div>
    <button @click="searchCity" class="btn btn-primary mb-3">Search</button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div v-if="city">
      <h2>{{ city.name }}, {{ city.countryCode }}</h2>
      <p><strong>Population:</strong> {{ city.population.toLocaleString() }}</p>

      <div v-if="country">
        <p><strong>Languages:</strong> {{ languages }}</p>
      </div>

      <div v-if="weather && weather.current">
        <h4>Weather</h4>
        <p><strong>Temperature:</strong> {{ weather.current.temp_c }}°C</p>
        <p><strong>Condition:</strong> {{ weather.current.condition.text }}</p>
      </div>
      <div v-else>
        <p class="text-warning">No weather data available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getCityInfo } from '@/composables/GetCityInfo';
import { getCountryInfo } from '@/composables/GetCountryInfo';
import { getWeatherInfo } from '@/composables/GetWeatherInfo';

const searchQuery = ref('');
const city = ref(null);
const country = ref(null);
const weather = ref(null);
const error = ref('');
const loading = ref(false);

const languages = computed(() => {
  if (!country.value?.languages) return 'N/A';
  return Object.values(country.value.languages).join(', ');
});

async function searchCity() {
  error.value = '';
  loading.value = true;
  city.value = null;
  country.value = null;
  weather.value = null;

  try {
    const cityData = await getCityInfo(searchQuery.value);
    if (!cityData) throw new Error('City not found');

    city.value = cityData;
    country.value = await getCountryInfo(cityData.countryCode);
    weather.value = await getWeatherInfo(cityData.latitude, cityData.longitude);
    console.log('Fetched weather:', weather.value);
  } catch (err) {
    error.value = err.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input {
  max-width: 300px;
}
</style>