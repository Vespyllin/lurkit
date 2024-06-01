import { cleanListing } from '../common/listing';

export const fetchPostData = async (
	comment_uri: string,
	sort?: RedditSortOptions
): Promise<ResultWrapper<PostData>> => {
	const baseURL = 'https://www.reddit.com';
	let queryParams = '?sr_detail=1';
	if (sort) queryParams += `&sort=${sort}`;

	const url = `${baseURL}${comment_uri}.json${queryParams}`;
	const fetchRes = await fetch(url);
	if (fetchRes.status != 200) {
		return {
			status: 'FAIL',
			reason: `Status ${fetchRes.status} ${!!fetchRes.statusText ? ':' + fetchRes.statusText : ''}`
		};
	}

	const fetchData: RedditListing = await fetchRes.json();

	const subredditFeedData = cleanData(fetchData);

	return { status: 'OK', data: subredditFeedData };
};

const cleanData = (post: any) => {
	const postParent = post[0].data.children[0].data as any;
	const postComments = post[1];
	const cleanedComments = cleanAllComments(postComments) ?? [];
	if (cleanedComments.length > 0 && !cleanedComments.at(-1)?.text)
		cleanedComments.splice(cleanedComments.length - 1, 1);

	const cleanedListing = cleanListing(postParent);

	const postData: PostData = {
		listing: cleanedListing,
		comments: cleanedComments
	};

	return postData;
};

const cleanAllComments = (init: any) => {
	if (!init?.data?.children || init.data.children.length == 0) return undefined;

	const res = init.data.children.map((x: any) => {
		const commentData: PostComment = {
			text: x.data.body,
			score: x.data.score,
			author: x.data.author,
			edited: x.data.edited,
			is_submitter: x.data.is_submitter,
			created_utc: x.data.created_utc,
			stickied: x.data.stickied,
			children: cleanAllComments(x.data.replies)?.filter((x) => !!x?.text)
		};

		return commentData;
	}) as PostComment[];

	return res;
};
