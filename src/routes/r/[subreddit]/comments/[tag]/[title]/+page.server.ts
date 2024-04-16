import { postClient } from '$lib/client/post';
export const load = async ({ params }) => {
	const { subreddit, tag, title } = params;

	const post = await postClient().fetchData(`/r/${subreddit}/comments/${tag}/${title}/`);

	return post;
};
