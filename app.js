const express = require('express');
const axios = require('axios');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherResults = await getWeatherData(cities);
    res.json({ weather: weatherResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

async function getWeatherData(cities) {
  const apiKey = process.env.CITY_API_KEY;
  const weatherPromises = cities.map(async (city) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return { [city]: `${response.data.main.temp}C` };
  });

  return Promise.all(weatherPromises).then((results) => {
    const weatherData = results.reduce((acc, result) => ({ ...acc, ...result }), {});
    return weatherData;
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
