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

	console.log("city", city);
	console.log("state", state);
	console.log("country", country);

	try {
		const weatherData = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${process.env.API_KEY}`)
		.then(response => {
			console.log(response);
			return response.json();
		})
		.then(json => {
			console.log(json);
			return json;
		});

		res.send({ weatherData });
	} catch (error) {
		res.send({ error: error.message });
	}
})

app.use('/', router);

app.listen(port, () => {
  console.log(`Weather app listening on port http://localhost:${port}`)
})

