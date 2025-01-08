import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSubredditFilter } from '$lib/db/filters';

export const GET: RequestHandler = async () => {
	const subredditFilter = await getSubredditFilter();

	return json({ filter: subredditFilter?.content.map((x) => x.toLowerCase()) ?? [] });
};
