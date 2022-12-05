
function googlePlacesInitialize() {
	const input = document.getElementById('searchTextField');
	const autocomplete = new google.maps.places.Autocomplete(input);
		google.maps.event.addListener(autocomplete, 'place_changed', function () {
			var place = autocomplete.getPlace();
			console.log(place);
			console.log(place.name);
			if (place.geometry && place.geometry.location) {
				console.log(place.geometry.location.lng());
				console.log(place.geometry.location.lat());
				getForecastData(place.geometry.location.lat(), place.geometry.location.lng());
			}				
		});
}

async function getForecastData(lat, lng) {
	const { forecast, error } = await fetch(`/weather?lat=${lat}&lng=${lng}`)
		.then(response => response.json())
		.then(json => json);

	const errorMessage = document.getElementById('error-message');
	if (error) {
		errorMessage.innerText = error;
		return;
	} else {
		errorMessage.innerText = "";
	}

	let htmlForecast = "";
	Object.entries(forecast).forEach(([key, value]) => {
		const date = new Date(key);
		const { temp: temperature, weather, wind } = value;
		const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

		const html = `
		<div>
			<div>${weekday[date.getDay()]}</div>
			<div>${date.toLocaleDateString('en-US')}</div>
			<div>${temperature}</div>
			<div>
				<img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="Weather - ${weather.description}">
			</div>
			<div>${weather.main}</div>
			<div>Wind Speed ${wind.speed} and Direction ${wind.deg} degrees</div>
		</div>
		`

		htmlForecast += html;
		
		console.log(weekday[date.getDay()]);
		console.log(date.toLocaleDateString('en-US'));
		console.log(temperature);
		console.log(weather);
		console.log(wind);
	})

	if (htmlForecast) {
		document.getElementById('forecast').innerHTML = htmlForecast;
	}
}

window.addEventListener('load', googlePlacesInitialize);
