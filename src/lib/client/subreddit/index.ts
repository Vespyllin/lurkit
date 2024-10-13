import { cleanListing } from '../common/listing';
import { redditFetch } from '../common/request';

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

	const fetchRes = await redditFetch<RedditListing<RedditT3DataWrapper>>(url);

	if (fetchRes.status != 'OK') return fetchRes;
	return {
		status: 'OK',
		data: fetchRes.data?.data?.children?.map((post) => cleanListing(post.data)) ?? []
	};
};
