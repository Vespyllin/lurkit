import { dev } from '$app/environment';
import { insertLog } from '$lib/db/log';
import { getGeoLocationData } from '$lib/geoClient';
import type { GeolocationData } from '$lib/geoClient/types';
import type { InsertOneResult } from 'mongodb';

const log = async (reqIp: string) => {
	let geoLocData: GeolocationData | undefined;
	try {
		geoLocData = await getGeoLocationData(reqIp);
	} catch (error) {
		geoLocData = { message: 'Could not retrieve geolocation data' };
	}

	try {
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
};

export async function handle({ event, resolve }) {
	if (!dev) await log(event.getClientAddress());

	// Suppress well-known Chrome DevTools requests
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	return resolve(event);
}
