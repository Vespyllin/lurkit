import { subredditClient } from '$lib/client/subreddit';

export const load = async ({ params }) => {
	const { subreddit } = params;
	return await subredditClient().fetchData(`r/${subreddit}`, 100);
};
