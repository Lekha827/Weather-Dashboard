<template>
  <div>
    <div class="weather-info">
      <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" alt="weather icon" />
      <h2>{{ weather.name }}</h2>
      <p>{{ weather.weather[0].description }}</p>
      <p>🌡 Temp: {{ weather.main.temp }} °{{ unit === 'metric' ? 'C' : 'F' }}</p>
      <p>💧 Humidity: {{ weather.main.humidity }}%</p>
      <p>🌬 Wind: {{ weather.wind.speed }} {{ unit === 'metric' ? 'm/s' : 'mph' }}</p>
    </div>

    <div class="forecast">
      <h3>5-Day Forecast</h3>
      <div class="forecast-list">
        <div class="forecast-day" v-for="(day, index) in forecast" :key="index">
          <p>{{ formatDate(day.dt_txt) }}</p>
          <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" />
          <p>{{ day.main.temp }}°</p>
          <p>{{ day.weather[0].main }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    weather: Object,
    forecast: Array,
    unit: String
  },
  methods: {
    formatDate(dt) {
      return new Date(dt).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.weather-info {
  background-color: #1d1d1d;
  padding: 20px;
  border-radius: 10px;
  display: inline-block;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.weather-info img {
  width: 60px;
}

.forecast {
  margin-top: 20px;
}

.forecast-list {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.forecast-day {
  background: #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  width: 100px;
  text-align: center;
}
</style>
