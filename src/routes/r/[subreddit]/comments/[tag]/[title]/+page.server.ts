import { postClient } from '$lib/client/post';
export const load = async ({ params }) => {
	const { subreddit, tag, title } = params;

	try {
		return await postClient().fetchData(`/r/${subreddit}/comments/${tag}/${title}/`);
	} catch (error) {
		return { status: 'INTERNAL', reason: 'An error occurred on the server.' };
	}
};
