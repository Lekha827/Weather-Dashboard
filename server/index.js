const http = require('http');
const url = require('url');
const { get } = require('https');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const PORT = 3000;

// Fetch current weather
const fetchWeather = (city, units = 'metric', callback) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => callback(null, data));
  }).on('error', err => callback(err));
};

// Fetch 5-day forecast
const fetchForecast = (city, units = 'metric', callback) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`;

  get(apiUrl, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => callback(null, data));
  }).on('error', err => callback(err));
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  if (pathname === '/api/weather' && method === 'GET') {
    const city = query.city;
    const units = query.units || 'metric';

    if (!city) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'City query parameter is required' }));
      return;
    }

    fetchWeather(city, units, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch weather data' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });

  } else if (pathname === '/api/forecast' && method === 'GET') {
    const city = query.city;
    const units = query.units || 'metric';

    if (!city) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'City query parameter is required' }));
      return;
    }

    fetchForecast(city, units, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch forecast data' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
