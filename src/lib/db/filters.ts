import { connect } from './mongo';

export type Filter = { type: string; content: string[] };

export const getSubredditFilter = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').findOne({ type: 'subreddit' });
};

export const getAllFilters = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').find().toArray();
};
