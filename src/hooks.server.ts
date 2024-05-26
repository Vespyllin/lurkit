import { insertLog } from '$lib/db/log';
import { getGeoLocationData } from '$lib/geoClient';

const log = async (reqIp: string) => {
	const geoLocData = await getGeoLocationData(reqIp);
	if (!!geoLocData?.message) return;

	await insertLog(geoLocData);
};

export async function handle({ event, resolve }) {
	await log(event.getClientAddress());
	return resolve(event);
}
