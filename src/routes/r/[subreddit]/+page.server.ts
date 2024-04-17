import { fetchFeedData } from '$lib/client/subreddit/index.js';

export const load = async ({ params }) => {
	const { subreddit } = params;
	return await fetchFeedData(`${subreddit}`, 100);
};
