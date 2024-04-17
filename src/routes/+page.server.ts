import { fetchFeedData } from '$lib/client/subreddit';

export const load = async () => {
	return await fetchFeedData(undefined, 100);
};
