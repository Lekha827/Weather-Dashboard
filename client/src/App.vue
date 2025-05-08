<template>
  <div class="app" :class="weatherBackground">
    <h1>Weather Dashboard</h1>

    <div class="controls">
      <select v-model="selectedCountry">
        <option disabled value="">Select Country</option>
        <option v-for="country in countries" :key="country">{{ country }}</option>
      </select>

      <input v-model="city" placeholder="Enter city..." @keyup.enter="getWeather" />
      <button @click="getWeather">Search</button>

      <button class="unit-toggle" @click="toggleUnit">
        Switch to °{{ unit === 'metric' ? 'F' : 'C' }}
      </button>
    </div>

    <WeatherDisplay
      v-if="weatherData"
      :weather="weatherData"
      :forecast="forecastData"
      :unit="unit"
    />
  </div>
</template>

<script>
import WeatherDisplay from './components/WeatherDisplay.vue';

export default {
  components: { WeatherDisplay },
  data() {
    return {
      city: 'New York',
      selectedCountry: 'US',
      countries: ['US', 'IN', 'CA', 'GB', 'AU'],
      unit: 'metric',
      weatherData: null,
      forecastData: []
    };
  },
  computed: {
    weatherBackground() {
      if (!this.weatherData) return 'default';
      const condition = this.weatherData.weather[0].main.toLowerCase();
      return condition.includes('cloud') ? 'cloudy' :
             condition.includes('rain') ? 'rainy' :
             condition.includes('clear') ? 'sunny' : 'default';
    }
  },
  methods: {
    async getWeather() {
      const query = `${this.city},${this.selectedCountry}`;
      try {
        const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(query)}&units=${this.unit}`);
        if (!weatherRes.ok) throw new Error('Weather fetch failed');
        this.weatherData = await weatherRes.json();
        console.log(this.weatherData);

        const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(query)}&units=${this.unit}`);
        if (!forecastRes.ok) throw new Error('Forecast fetch failed');
        const fullForecast = await forecastRes.json();

        this.forecastData = fullForecast.list.filter((_, idx) => idx % 8 === 0);
      } catch (err) {
        alert('Could not fetch weather.');
        this.weatherData = null;
        this.forecastData = [];
      }
    },
    toggleUnit() {
      this.unit = this.unit === 'metric' ? 'imperial' : 'metric';
      if (this.city) this.getWeather();
    }
  },
  mounted() {
    this.getWeather();
  }
};
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  background-color: #111;
  color: white;
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

.app {
  text-align: center;
  padding: 20px;
  min-height: 100vh;
  transition: background 0.5s;
}

.controls {
  margin-bottom: 20px;
}

input, select, button {
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  border: none;
}

button {
  background-color: #333;
  color: white;
  cursor: pointer;
}

.unit-toggle {
  background-color: #444;
  font-size: 0.9em;
}

/* Dynamic backgrounds */
.sunny {
  background-color: #222;
}
.cloudy {
  background-color: #2b2b2b;
}
.rainy {
  background-color: #1a1a1a;
}
.default {
  background-color: #111;
}
</style>
