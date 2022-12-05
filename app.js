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
	const { city, state, country } = req.query;

	if (!city) {
		res.send({ error: "Enter city value." });
	}

	if (!state) {
		res.send({ error: "Enter state value." });
	}

	if (!country) {
		res.send({ error: "Enter country value." });
	}

	try {
		const locationData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${process.env.API_KEY}`)
			.then(response => {
				console.log(response);
				return response.json();
			})
			.then(json => {
				console.log(json);
				return json;
			});

		const { lat, lon } = locationData[0];

		if (!lat || !lon) {
			res.send({ error: "Location not found" });
		}
	

		const weatherData = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.API_KEY}`)
			.then(response => {
				console.log(response);
				return response.json();
			})
			.then(json => {
				console.log(json);
				return json;
			});

		const forecast = {}
		
		weatherData.list.forEach(weather => {
			const date = new Date(weather.dt_txt).toLocaleDateString('en-US');
			const data = weather.main;
			data.weather = weather.weather[0];
			data.wind = weather.wind;
			forecast[date] = data;
		})

		console.log(forecast);

		res.send({ forecast });
	} catch (error) {
		res.send({ error: error.message });
	}
})

app.use('/', router);

app.listen(port, () => {
  console.log(`Weather app listening on port http://localhost:${port}`)
})

