import { cleanListing } from '../common/listing';
import { redditFetch } from '../common/request';

export const fetchPostData = async (
	comment_uri: string,
	sort?: RedditSortOptions
): Promise<ResultWrapper<PostData>> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}${comment_uri}.json${queryParams}`;

	const fetchRes = await redditFetch<RedditPostData>(url);

	if (fetchRes.status != 'OK') return fetchRes;
	return { status: 'OK', data: cleanData(fetchRes.data) };
};

const cleanData = (post: RedditPostData) => {
	const [listing, comments] = post;

	const listingData = listing.data!.children![0].data; // Should always return data from the Reddit API

	const cleanedListing = cleanListing(listingData);

	const cleanedComments = cleanComments(comments) ?? [];
	if (cleanedComments.length > 0 && !cleanedComments.at(-1)?.text)
		cleanedComments.splice(cleanedComments.length - 1, 1);

	const postData: PostData = {
		listing: cleanedListing,
		comments: cleanedComments
	};

	return postData;
};

const cleanComments = (comments: RedditT1Data['replies']): PostComment[] => {
	if (!comments.data?.children) return [];

	return comments.data.children
		.filter((x) => x.kind == 't1')
		.map((x) => {
			const {
				body_html,
				score,
				author,
				edited,
				is_submitter,
				distinguished,
				score_hidden,
				created_utc,
				stickied,
				replies
			} = x.data;

			return {
				text: body_html,
				children: cleanComments(replies)?.filter((x) => !!x?.text),
				score: !score_hidden ? score : undefined,
				author,
				edited,
				is_submitter,
				distinguished,
				created_utc,
				stickied
			};
		});
};
