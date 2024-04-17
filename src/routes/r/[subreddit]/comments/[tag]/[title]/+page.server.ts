import { fetchPostData } from '$lib/client/post/index.js';

export const load = async ({ params }) => {
	const { subreddit, tag, title } = params;

	try {
		return await fetchPostData(`/r/${subreddit}/comments/${tag}/${title}/`);
	} catch (error) {
		return { status: 'INTERNAL', reason: 'An error occurred on the server.' };
	}
};
