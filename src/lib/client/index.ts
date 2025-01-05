const baseURL = 'https://www.reddit.com';

export const fetchListings = async (
	subreddit?: string,
	count?: number,
	after?: string,
	sort?: RedditSubredditSortOptions,
	sr_detail?: boolean,
	timescale?: string
): Promise<RedditListing<RedditT3DataWrapper> | undefined> => {
	const queryParams =
		'?' +
		Object.entries({ count, after, sr_detail, t: timescale })
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
	sort?: RedditCommentSortOption
): Promise<RedditListingCommentsDataWrapper> => {
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/${title}/.json${queryParams}`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchSubreddit = async (
	subreddit: string
): Promise<RedditT5DataWrapper | undefined> => {
	const url = `${baseURL}/r/${subreddit}/about/.json`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchComment = async (
	subreddit: string,
	tag: string,
	comment_id: string,
	sort?: RedditCommentSortOption
): Promise<RedditListingCommentsDataWrapper> => {
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/comment/${comment_id}/.json${queryParams}`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchUserAbout = async (username: string): Promise<RedditT2DataWrapper> => {
	const url = `${baseURL}/user/${username}/about/.json`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};

export const fetchUserOverview = async (username: string): Promise<RedditUserWrapper> => {
	const url = `${baseURL}/user/${username}/submitted/.json?sr_detail=1`;

	const fetchRes = await fetch(url);
	return await fetchRes.json();
};
