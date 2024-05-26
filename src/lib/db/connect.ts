import { PRIVATE_MONGODB_URI } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(PRIVATE_MONGODB_URI);
const connectToDb = client.connect;

export default connectToDb;
