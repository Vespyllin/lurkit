import { cleanListing } from '../common/listing';

export const fetchFeedData = async (
	subreddit?: string,
	count?: number,
	after?: string,
	sort?: RedditSortOptions
): Promise<ResultWrapper<FeedData>> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?limit=100&sr_detail=1';
	if (count !== undefined) queryParams += `&limit=${count}`;
	if (after !== undefined) queryParams += `&after=${after}`;

	const cleanSubreddit = subreddit ? `/r/${subreddit}` : '';
	const cleanSort = sort ? `/${sort}` : '';

	const url = `${baseURL}${cleanSubreddit}${cleanSort}/.json${queryParams}`;

	const fetchRes = await fetch(url);
	if (fetchRes.status != 200) {
		return {
			status: 'FAIL',
			reason: `Status ${fetchRes.status}: ${fetchRes.statusText}`
		};
	}

	const fetchData: RedditListing = await fetchRes.json();

	const feedData = cleanData(fetchData);

	return { status: 'OK', data: feedData };
};

const cleanData = (feed: RedditListing) => {
	const subredditFeedData: FeedData = {
		dist: feed.data.dist,
		after: feed.data.after,
		posts: feed.data.children.map(cleanListing)
	};

	return subredditFeedData;
};
