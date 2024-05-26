import { insertLog } from '$lib/db/log';
import { getGeoLocationData } from '$lib/geoClient';

const log = async (reqIp: string) => {
	try {
		const geoLocData = await getGeoLocationData(reqIp);
		await insertLog(geoLocData);
	} catch (error) {
		console.log('Could not retrieve IP data/save log.');
	}
};

export async function handle({ event, resolve }) {
	log(event.getClientAddress());

	return resolve(event);
}
