import type { GeolocationData } from '$lib/geoClient';
import { connect } from './mongo';

export const insertLog = async (data: GeolocationData) => {
	const client = await connect();

	return await client.collection('ip-log').insertOne(data);
};
