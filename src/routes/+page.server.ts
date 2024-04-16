import { subredditClient } from '$lib/client/subreddit';

export const load = async () => {
	return await subredditClient().fetchData(undefined, 100);
};
