import { insertLog } from '$lib/db/log';
import { getGeoLocationData } from '$lib/geoClient';
import type { GeolocationData } from '$lib/geoClient/types';
import type { InsertOneResult } from 'mongodb';

const log = async (reqIp: string) => {
	const date = new Date().toString();
	console.log('In log fn', date);

	let geoLocData: GeolocationData | undefined;
	try {
		geoLocData = await getGeoLocationData(reqIp);

		console.log(geoLocData);
	} catch (error) {
		console.log(`Could not retrieve IP data. ${reqIp}`);
		return;
	}

	try {
		console.log('Attempting to save log to DB.', date);
		let mongoRes: InsertOneResult<Document> | undefined;

		if ('message' in geoLocData) {
			mongoRes = await insertLog({ message: `${geoLocData.message} on IP: ${reqIp}` });
		} else {
			mongoRes = await insertLog(geoLocData);
		}

		if (!mongoRes || !mongoRes.acknowledged) {
			console.log('Could not save log to DB. (no ack)');
		} else {
			console.log(`Saved log to DB. id: ${mongoRes.insertedId}`);
		}
	} catch (error) {
		console.log(`Could not save log to DB. (${(error as Error)?.message})`);
	}

	console.log('Log fn executed.', date);
};

export async function handle({ event, resolve }) {
	log(event.getClientAddress());

	return resolve(event);
}
