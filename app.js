const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
const port = 3030

const path = require('path');
const router = express.Router();

app.use(bodyParser.json())
app.use(cors());
app.use(express.static('public'));

require('dotenv').config();

router.get('/', async (req,res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/weather', async (req, res) => {
	const { lat, lng } = req.query;

	if (!lat || !lng) {
		return res.send({ error: "Location data was not received." });
	}

	try {
		const weatherData = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&exclude=minutely,hourly,alerts&appid=${process.env.API_KEY}`)
			.then(response => response.json())
			.then(json => json);

		if (!weatherData || !weatherData.current || !weatherData.daily) {
			return res.send({ error: "Data not found." });
		}

		const forecast = {}

		function addForecast(weather) {
			const date = new Date(weather.dt * 1000).toLocaleDateString('en-US');
			const data = weather;
			data.weather = weather.weather[0];
			data.wind_deg = weather.wind_deg;
			data.wind_speed = weather.wind_speed;
			forecast[date] = data;
		}

		addForecast(weatherData.current);

		weatherData.daily.forEach(weather => {
			addForecast(weather);
		})

		return res.send({ forecast });
	} catch (error) {
		return res.send({ error: error.message });
	}
})

app.use('/', router);

app.listen(port, () => {
  console.log(`Weather app listening on port http://localhost:${port}`)
})

