<template>
  <div class="container py-4">
    <div class="mb-3" style="position:relative;">
      <input v-model="searchQuery" class="form-control" placeholder="Enter city name" @input="debouncedFetchSuggestions"
        @keyup.enter="searchCity" @keydown.down="highlightNext" @keydown.up="highlightPrev"
        @keydown.enter="selectSuggestion" />
      <ul v-if="suggestions.length" class="suggestions-list">
        <li v-for="(suggestion, idx) in suggestions" :key="suggestion.id || suggestion.name"
          :class="{ highlighted: idx === highlightedIndex }" @mousedown.prevent="selectSuggestion(idx)">
          {{ suggestion.name }}, {{ suggestion.countryCode }}
        </li>
      </ul>
    </div>

    <button @click="searchCity" class="btn btn-primary mb-3">Search</button>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <!-- <div v-if="image">{{ city.image }}</div> -->
    <div v-if="image">
      <img :src="image" :alt="city.name + ' photo'" style="max-width: 100%; max-height: 400px; margin-top: 16px;" />
    </div>

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
import { ref, computed } from 'vue'
import axios from 'axios'
import { getCityInfo } from '@/composables/GetCityInfo'
import { getCountryInfo } from '@/composables/GetCountryInfo'
import { getWeatherInfo } from '@/composables/GetWeatherInfo'
import { getCityPhoto } from '@/composables/GetCityPhotos'

// 🔎 STATE
const searchQuery = ref('')
const suggestions = ref([])
const highlightedIndex = ref(-1)
const city = ref(null)
const country = ref(null)
const weather = ref(null)
const image = ref(null)
const error = ref('')
const loading = ref(false)

const languages = computed(() => {
  if (!country.value?.languages) return 'N/A'
  return Object.values(country.value.languages).join(', ')
})

// ✅ FETCH SUGGESTIONS WITH DEBOUNCE
let debounceTimeout
function debouncedFetchSuggestions() {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(fetchSuggestions, 350)
}

async function fetchSuggestions() {
  const query = searchQuery.value.trim()
  if (!query) {
    suggestions.value = []
    return
  }

  const apiKey = process.env.VUE_APP_RAPID_API_KEY
  if (!apiKey) {
    console.error('Missing RapidAPI key')
    error.value = 'API key not found.'
    return
  }

  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: {
        namePrefix: query,
        limit: 5,
        sort: '-population',
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    })

    const results = response.data.data
    suggestions.value = results.length > 0 ? results : []
    highlightedIndex.value = -1
  } catch (err) {
    suggestions.value = []
    console.error('Suggestion fetch error:', err)
  }
}

// 🔍 AUTOCOMPLETE KEYBOARD EVENTS
function highlightNext() {
  if (highlightedIndex.value < suggestions.value.length - 1) {
    highlightedIndex.value++
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

function selectSuggestion(idx = highlightedIndex.value) {
  if (idx >= 0 && idx < suggestions.value.length) {
    searchQuery.value = suggestions.value[idx].name
    suggestions.value = []
    searchCity()
  }
}

// 🔍 SEARCH FINAL CITY
async function searchCity() {
  error.value = ''
  loading.value = true
  city.value = null
  country.value = null
  weather.value = null
  image.value = null;

  try {
    const cityData = await getCityInfo(searchQuery.value)
    if (!cityData) throw new Error('City not found')

    city.value = cityData
    const imageurl = await getCityPhoto(cityData.name)
    image.value = imageurl
    console.log("the image url is:", imageurl)
    country.value = await getCountryInfo(cityData.countryCode)
    weather.value = await getWeatherInfo(cityData.latitude, cityData.longitude)
  } catch (err) {
    error.value = err.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input {
  max-width: 300px;
}

.suggestions-list {
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  background: white;
  position: absolute;
  z-index: 10;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li.highlighted {
  background: #eee;
}
</style>
