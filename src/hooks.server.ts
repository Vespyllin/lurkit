import { PRIVATE_IP_LOCATION_API_KEY } from '$env/static/private';

export async function handle({ event, resolve }) {
	const ip = event.getClientAddress();
	const ipLocationReq = fetch(
		`https://api.ipgeolocation.io/ipgeo?apiKey=${PRIVATE_IP_LOCATION_API_KEY}&ip=${ip}`
	);
	ipLocationReq.then((x) => x.json().then((x) => console.log(x)));
	return resolve(event);
}
