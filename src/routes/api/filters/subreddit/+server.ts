import { pushSubredditFilter, removeSubredditFilter } from '$lib/db/filters';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { subreddit } = await request.json();

	if (!subreddit) return json({ error: 'Parameter is required' }, { status: 400 });

	if (!/^r\/[a-zA-Z0-9]+/.test(subreddit))
		return json({ error: 'Invalid parameter' }, { status: 400 });

	const res = await pushSubredditFilter(subreddit.toLowerCase());

	if (res == undefined) return json({ error: 'Internal Error' }, { status: 500 });

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { subreddit } = await request.json();

	if (!subreddit) return json({ error: 'Parameter is required' }, { status: 400 });

	if (!/^r\/[a-zA-Z0-9]+/.test(subreddit))
		return json({ error: 'Invalid parameter' }, { status: 400 });

	const res = await removeSubredditFilter(subreddit.toLowerCase());

	if (res == undefined) return json({ error: 'Internal Error' }, { status: 500 });

	return json({ success: true });
};
