import { PRIVATE_MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(PRIVATE_MONGODB_URI);

export const connect = async () => {
	await client.connect();
	return client.db('lurkitDB');
};

export const disconnect = client.close;
