const form = document.getElementById('location-form');
form.addEventListener("submit", async function(event) {
	event.preventDefault();
	const city = document.getElementById("input-city").value;
	const state = document.getElementById("input-state").value;
	const country = document.getElementById("input-country").value;
	const data = await fetch(`/weather?city=${city}&state=${state}&country=${country}`)
	.then(response => response.json())
	.then(json => json);

	console.log(data);
})