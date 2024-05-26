import { PRIVATE_IP_LOCATION_API_KEY } from '$env/static/private';
import type { GeolocationData } from './types';

export const getGeoLocationData = async (ip: string) => {
	const apiURL = 'https://api.ipgeolocation.io/ipgeo';
	const geoLocationRes = await fetch(`${apiURL}?apiKey=${PRIVATE_IP_LOCATION_API_KEY}&ip=${ip}`);

	return (await geoLocationRes.json()) as GeolocationData;
};
