import { connect } from './mongo';

export type Filter = { type: string; content: string[] };

export const pushSubredditFilter = async (subreddit: string) => {
	const client = await connect();

	const res = await client
		.collection<Filter>('filters')
		.updateOne({ type: 'subreddit' }, { $addToSet: { content: subreddit } });

	// modifiedCount might return 1 even if the document remains the same as the timestamp of the entry may still be changed
	// In that case remove the timestamp from the schema
	return !!res.modifiedCount;
};

export const getSubredditFilter = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').findOne({ type: 'subreddit' });
};

export const getAllFilters = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').find().toArray();
};
