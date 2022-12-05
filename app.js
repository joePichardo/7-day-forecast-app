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
		const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=imperial&appid=${process.env.API_KEY}`)
			.then(response => response.json())
			.then(json => json);

		const forecast = {}
		
		weatherData.list.forEach(weather => {
			const date = new Date(weather.dt_txt).toLocaleDateString('en-US');
			const data = weather.main;
			data.weather = weather.weather[0];
			data.wind = weather.wind;
			forecast[date] = data;
		})

		res.send({ forecast });
	} catch (error) {
		res.send({ error: error.message });
	}
})

app.use('/', router);

app.listen(port, () => {
  console.log(`Weather app listening on port http://localhost:${port}`)
})

