const baseURL = 'https://oauth.reddit.com';

const headers = new Headers({
	Accept: 'application/json',
	'Content-Type': 'application/json'
	// 'User-Agent': 'fspez/420 by [redacted]'
});

const formatQueryParams = (paramObj: Object) => {
	const entries = Object.entries(paramObj);
	if (entries.length == 0) return '';

	return (
		'?' +
		entries
			.map((x) => {
				const [k, v] = x;
				if (!v) return undefined;
				return `${k}=${v}`;
			})
			.filter((x) => !!x)
			.join('&')
	);
};

export const fetchListings = async (
	subreddit?: string,
	limit?: number,
	after?: string,
	sort?: RedditSubredditSortOptions,
	sr_detail?: boolean,
	timescale?: string
): Promise<RedditListing<RedditT3DataWrapper> | undefined> => {
	const queryParams = formatQueryParams({ limit, after, sr_detail, t: timescale });

	const cleanSubreddit = subreddit ? `/r/${subreddit}` : '';
	const cleanSort = sort ? `/${sort}` : '';

	const url = `${baseURL}${cleanSubreddit}${cleanSort}/.json${queryParams}`;

	const res = await fetch(url, { headers });
	return await res.json();
};

export const fetchListing = async (
	subreddit: string,
	tag: string,
	title: string,
	sort: RedditCommentSortOption | undefined = 'top'
): Promise<RedditListingCommentsDataWrapper> => {
	const queryParams = formatQueryParams({ sr_detail: 1, sort });

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/${title}/.json${queryParams}`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchSubreddit = async (
	subreddit: string
): Promise<RedditT5DataWrapper | undefined> => {
	const url = `${baseURL}/r/${subreddit}/about/.json`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchComment = async (
	subreddit: string,
	tag: string,
	comment_id: string,
	sort: RedditCommentSortOption | undefined = 'top'
): Promise<RedditListingCommentsDataWrapper> => {
	const queryParams = formatQueryParams({ sr_detail: 1, sort });

	const url = `${baseURL}/r/${subreddit}/comments/${tag}/comment/${comment_id}/.json${queryParams}`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchUserAbout = async (username: string): Promise<RedditT2DataWrapper> => {
	const url = `${baseURL}/user/${username}/about/.json`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchUserOverview = async (
	username: string,
	limit?: number,
	after?: string
): Promise<RedditUserWrapper> => {
	const queryParams = formatQueryParams({ sr_detail: 1, limit, after });

	const url = `${baseURL}/user/${username}/.json${queryParams}`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchUserSubmitted = async (
	username: string,
	limit?: number,
	after?: string
): Promise<RedditListing<RedditT3DataWrapper>> => {
	const queryParams = formatQueryParams({ sr_detail: 1, limit, after });

	const url = `${baseURL}/user/${username}/submitted.json${queryParams}`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchUserCommented = async (
	username: string,
	limit?: number,
	after?: string
): Promise<RedditListing<RedditT1DataWrapper>> => {
	const queryParams = formatQueryParams({ sr_detail: 1, limit, after });

	const url = `${baseURL}/user/${username}/comments.json${queryParams}`;

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};

export const fetchSearchQuery = async (
	queryString: string,
	type?: RedditSearchCategories,
	limit?: number,
	after?: string
): Promise<RedditListing<RedditT3DataWrapper>> => {
	const queryParams = formatQueryParams({ q: queryString, type, sr_detail: 1, limit, after });
	const url = `${baseURL}/search/.json${queryParams}`;
	console.log(url);

	const fetchRes = await fetch(url, { headers });
	return await fetchRes.json();
};
