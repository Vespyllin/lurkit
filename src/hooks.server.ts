import { insertLog } from '$lib/db/log';
import { getGeoLocationData } from '$lib/geoClient';
import type { GeolocationData } from '$lib/geoClient/types';

const log = async (reqIp: string) => {
	let geoLocData: GeolocationData | undefined;
	try {
		geoLocData = await getGeoLocationData(reqIp);

		console.log(geoLocData);
	} catch (error) {
		console.log(`Could not retrieve IP data. ${reqIp}`);
		return;
	}

	try {
		let mongoRes = undefined;
		if ('message' in geoLocData) {
			mongoRes = await insertLog({ message: `${geoLocData.message} on IP: ${reqIp}` });
		} else {
			mongoRes = await insertLog(geoLocData);
		}

		if (!mongoRes.acknowledged) {
			console.log('Could not save log to DB. (no ack)');
		}
	} catch (error) {
		console.log(`Could not save log to DB. (${(error as Error)?.message})`);
	}
};

export async function handle({ event, resolve }) {
	log(event.getClientAddress());

	return resolve(event);
}
