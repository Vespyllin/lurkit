import { cleanListing } from '../common/listing';
import { redditFetch } from '../common/request';

export const fetchFeedData = async (
	subreddit?: string,
	count?: number,
	after?: string,
	sort?: RedditSortOptions,
	sr_detail?: boolean
): Promise<ResultWrapper<ListingData[]>> => {
	const baseURL = 'https://www.reddit.com';
	const queryParams =
		'?' +
		Object.entries({ count, after, sort, sr_detail })
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

	const fetchRes = await redditFetch<RedditListing<RedditT3DataWrapper>>(url);

	if (fetchRes.status != 'OK') return fetchRes;
	return {
		status: 'OK',
		data: fetchRes.data?.data?.children?.map((post) => cleanListing(post.data)) ?? []
	};
};

export const fetchSubredditData = async (
	subreddit: string
): Promise<ResultWrapper<SubredditData>> => {
	const baseURL = 'https://www.reddit.com';
	const url = `${baseURL}/r/${subreddit}/about/.json`;

	const fetchRes = await redditFetch<RedditT5DataWrapper>(url);

	if (fetchRes.status != 'OK') return fetchRes;
	return {
		status: 'OK',
		data: cleanSubreddit(fetchRes.data.data)
	};
};

const cleanSubreddit = (data: RedditT5Data): SubredditData => {
	const {
		accounts_active,
		active_user_count,
		banner_background_color,
		banner_background_image,
		banner_img,
		comment_score_hide_mins,
		community_icon,
		created,
		created_utc,
		description,
		display_name,
		header_title,
		icon_img,
		id,
		key_color,
		lang,
		mobile_banner_image,
		name,
		over18,
		primary_color,
		public_description,
		public_traffic,
		quarantine,
		restrict_commenting,
		subreddit_type,
		subscribers,
		title
	} = data;

	return {
		accounts_active,
		active_user_count,
		banner_background_color,
		banner_background_image: banner_background_image.split('?')[0],
		mobile_banner_image,
		comment_score_hide_mins,
		community_icon,
		created_utc,
		description,
		display_name,
		header_title,
		icon_img,
		id,
		key_color,
		lang,
		name,
		over18,
		primary_color,
		public_description,
		public_traffic,
		quarantine,
		restrict_commenting,
		subreddit_type,
		subscribers,
		title
	};
};
