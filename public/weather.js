
function googlePlacesInitialize() {
	const input = document.getElementById('searchTextField');
	const autocomplete = new google.maps.places.Autocomplete(input);
		google.maps.event.addListener(autocomplete, 'place_changed', function () {
			var place = autocomplete.getPlace();
			document.getElementById('forecast').innerHTML = `<div class="loader" role="alert" aria-busy="true"></div>`;
			if (place.formatted_address) {
				document.getElementById('forecast-location').innerHTML = `<h1>${place.formatted_address} - Forecast</h1>`;
			} else {
				document.getElementById('forecast-location').innerHTML = "";
			}
			if (place.geometry && place.geometry.location) {
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
		errorMessage.innerHTML = `<div class="error-message">${error}</div>`;
		return;
	} else {
		errorMessage.innerHTML = "";
	}

	let htmlForecast = "";
	Object.entries(forecast).forEach(([key, value]) => {
		const date = new Date(key);
		const { temp: temperature, weather, wind_deg, wind_speed } = value;
		const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

		const html = `
		<div class="forecast__wrapper">
			<div class="forecast__wrapper--padding">
				<h2 class="forecast__weekday">${weekday[date.getDay()]}</h2>
				<p class="forecast__date">${date.toLocaleDateString('en-US')}</p>
				<p class="forecast__temperature">${temperature.day}&#176;</p>
				<p class="forecast__weather">${weather.main}</p>
				<div class="forecast__icon">
					<img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="Weather - ${weather.description}">
				</div>
				<div class="forecast__wind">
					<p class="forecast__wind--title">Wind</p>
					<p class="forecast__wind--speed">Speed: ${wind_speed} mph</p>
					<p class="forecast__wind--direction">Direction: ${wind_deg} degrees</p>
				</div>
			</div>
		</div>
		`
		htmlForecast += html;
	})

	if (htmlForecast) {
		document.getElementById('forecast').innerHTML = htmlForecast;
	}
}

getForecastData(33.5386523, -112.1859866);

window.addEventListener('load', googlePlacesInitialize);
