import { connect } from './mongo';

export type Filter = { type: string; content: string[] };

export const pushKeywordFilter = async (keyword: string) => {
	try {
		const client = await connect();

		const res = await client
			.collection<Filter>('filters')
			.updateOne({ type: 'keyword' }, { $addToSet: { content: keyword } });

		// modifiedCount might return 1 even if the document remains the same as the timestamp of the entry may still be changed
		// In that case remove the timestamp from the schema
		return !!res.modifiedCount;
	} catch (error) {
		return undefined;
	}
};

export const removeKeywordFilter = async (keyword: string) => {
	try {
		const client = await connect();

		const res = await client
			.collection<Filter>('filters')
			.updateOne({ type: 'keyword' }, { $pull: { content: keyword } });

		// modifiedCount might return 1 even if the document remains the same as the timestamp of the entry may still be changed
		// In that case remove the timestamp from the schema
		return !!res.modifiedCount;
	} catch (error) {
		return undefined;
	}
};

export const getKeywordFilter = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').findOne({ type: 'keyword' });
};

export const pushSubredditFilter = async (subreddit: string) => {
	try {
		const client = await connect();

		const res = await client
			.collection<Filter>('filters')
			.updateOne({ type: 'subreddit' }, { $addToSet: { content: subreddit } });

		// modifiedCount might return 1 even if the document remains the same as the timestamp of the entry may still be changed
		// In that case remove the timestamp from the schema
		return !!res.modifiedCount;
	} catch (error) {
		return undefined;
	}
};

export const removeSubredditFilter = async (subreddit: string) => {
	try {
		const client = await connect();

		const res = await client
			.collection<Filter>('filters')
			.updateOne({ type: 'subreddit' }, { $pull: { content: subreddit } });

		// modifiedCount might return 1 even if the document remains the same as the timestamp of the entry may still be changed
		// In that case remove the timestamp from the schema
		return !!res.modifiedCount;
	} catch (error) {
		return undefined;
	}
};

export const getSubredditFilter = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').findOne({ type: 'subreddit' });
};

export const getAllFilters = async () => {
	const client = await connect();

	return await client.collection<Filter>('filters').find().toArray();
};
