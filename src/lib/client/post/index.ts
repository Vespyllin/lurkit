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
			reason: `Status ${fetchRes.status}: ${fetchRes.statusText}`
		};
	}

	const fetchData: RedditListing = await fetchRes.json();

	const subredditFeedData = cleanData(fetchData);

	return { status: 'OK', data: subredditFeedData };
};

const cleanData = (post: any) => {
	const postParent = post[0].data.children[0].data as any;
	const postComments = post[1];
	const cleanedComments = getAllComments(postComments) ?? [];
	if (cleanedComments.length > 0 && !cleanedComments.at(-1)?.text)
		cleanedComments.splice(cleanedComments.length - 1, 1);

	const postData: PostData = {
		listing: {
			author: postParent.author,
			created_utc: postParent.created_utc,
			edited: postParent.edited,
			is_gallery: postParent.is_gallery,
			is_self: postParent.is_self,
			is_video: postParent.is_video,
			name: postParent.name,
			title: postParent.title,
			media_metadata: postParent.media_metadata,
			num_comments: postParent.num_comments,
			permalink: postParent.permalink,
			post_hint: postParent.post_hint,
			score: postParent.score,
			secure_media_embed: postParent.secure_media_embed,
			selftext: postParent.selftext,
			over_18: postParent.over_18,
			subreddit: {
				community_icon: postParent.sr_detail.community_icon,
				description: postParent.sr_detail.description,
				display_name: postParent.sr_detail.display_name_prefixed,
				over_18: postParent.sr_detail.over_18,
				icon_img: postParent.sr_detail.icon_img,
				public_description: postParent.sr_detail.public_description,
				title: postParent.sr_detail.title
			},
			thumbnail: postParent.thumbnail,
			upvote_ratio: postParent.upvote_ratio,
			url: postParent.url,
			gallery_data: postParent.gallery_data,
			secure_media: postParent.secure_media
		},
		comments: cleanedComments
	};

	return postData;
};

const getAllComments = (init: any) => {
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
			children: getAllComments(x.data.replies)?.filter((x) => !!x?.text)
		};

		return commentData;
	}) as PostComments;

	return res;
};
