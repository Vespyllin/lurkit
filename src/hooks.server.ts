// import { saveLogToDb } from '$lib/db';
import { getGeoLocationData } from '$lib/geoClient';

// const log = async (reqIp: string) => {
// 	const geoLocData = await getGeoLocationData(reqIp);
// 	if (!!geoLocData?.message) return;

// 	await saveLogToDb(geoLocData);
// };

export async function handle({ event, resolve }) {
	// log(event.getClientAddress());
	return resolve(event);
}
