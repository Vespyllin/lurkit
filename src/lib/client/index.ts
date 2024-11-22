import { comment } from 'postcss';

export const fetchListings = async (
	subreddit?: string,
	count?: number,
	after?: string,
	sort?: RedditSubredditSortOptions,
	sr_detail?: boolean
): Promise<RedditListing<RedditT3DataWrapper> | undefined> => {
	const baseURL = 'https://www.reddit.com';
	const queryParams =
		'?' +
		Object.entries({ count, after, sr_detail })
			.map((x) => {
				const [k, v] = x;
				if (!v) return undefined;
				return `${k}=${v}`;
			})
			.filter((x) => !!x)
			.join('&');

	const cleanSubreddit = subreddit ? `/r/${subreddit}` : '';
	const cleanSort = sort ? `/${sort}` : '';

	const url = `${baseURL}${cleanSubreddit}${cleanSort}/.json${queryParams}`;

	const res = await fetch(url);
	return await res.json();
};

export const fetchListingComments = async (
	subreddit: string,
	tag: string,
	title: string,
	sort?: RedditCommentSortOptions
): Promise<RedditListingCommentsDataWrapper> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/${title}/.json${queryParams}`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchSubreddit = async (
	subreddit: string
): Promise<RedditT5DataWrapper | undefined> => {
	const baseURL = 'https://www.reddit.com';
	const url = `${baseURL}/r/${subreddit}/about/.json`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchComment = async (
	subreddit: string,
	tag: string,
	comment_id: string,
	sort?: RedditCommentSortOptions
): Promise<RedditListingCommentsDataWrapper> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/comment/${comment_id}/.json${queryParams}`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};
