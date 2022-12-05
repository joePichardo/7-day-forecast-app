async function getData() {
	const city = "Phoenix";
	const state = "AZ";
	const country = "US";
	const data = await fetch(`/weather?city=${city}&state=${state}&country=${country}`)
		.then(response => response.json())
		.then(json => json);
	console.log(data);
}