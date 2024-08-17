import { cleanListing } from '../common/listing';

export const fetchFeedData = async (
	subreddit?: string,
	count?: number,
	after?: string,
	sort?: RedditSortOptions
): Promise<ResultWrapper<ListingData[]>> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?limit=100&sr_detail=1';
	if (count !== undefined) queryParams += `&limit=${count}`;
	if (after !== undefined) queryParams += `&after=${after}`;

	const cleanSubreddit = subreddit ? `/r/${subreddit}` : '';
	const cleanSort = sort ? `/${sort}` : '';

	const url = `${baseURL}${cleanSubreddit}${cleanSort}/.json${queryParams}`;

	try {
		const fetchRes = await fetch(url);
		if (fetchRes.status != 200) {
			return {
				status: 'FAIL',
				reason: `Status ${fetchRes.status} ${!!fetchRes.statusText ? `: ${fetchRes.statusText}` : ''}`
			};
		}

		const fetchData: RedditListing = await fetchRes.json();

		const feedData = cleanData(fetchData);

		return { status: 'OK', data: feedData };
	} catch (e: any) {
		return {
			status: 'FAIL',
			reason: `Status 500: ${e.message}`
		};
	}
};

const cleanData = (feed: RedditListing) => {
	return feed.data.children.map((post) => cleanListing(post.data)) as ListingData[];
};
