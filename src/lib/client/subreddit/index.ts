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

	const feedData = cleanResponse(fetchData);

	return { status: 'OK', data: feedData };
};

const cleanResponse = (feed: RedditListing) => {
	const subredditFeedData: FeedData = {
		dist: feed.data.dist,
		after: feed.data.after,
		posts: feed.data.children.map((child) => {
			return {
				author: child.data.author,
				created_utc: child.data.created_utc,
				edited: child.data.edited,
				is_gallery: child.data.is_gallery,
				is_self: child.data.is_self,
				is_video: child.data.is_video,
				media_metadata: child.data.media_metadata,
				name: child.data.name,
				num_comments: child.data.num_comments,
				permalink: child.data.permalink,
				post_hint: child.data.post_hint,
				score: child.data.score,
				secure_media_embed: child.data.secure_media_embed,
				selftext: child.data.selftext,
				title: child.data.title,
				upvote_ratio: child.data.upvote_ratio,
				url: child.data.url,
				gallery_data: child.data.gallery_data,
				secure_media: child.data.secure_media,
				thumbnail: child.data.thumbnail,
				over_18: child.data.over_18,

				subreddit: {
					display_name: child.data.sr_detail.display_name_prefixed,
					community_icon: child.data.sr_detail.community_icon,
					description: child.data.sr_detail.description,
					over_18: child.data.sr_detail.over_18,
					icon_img: child.data.sr_detail.icon_img,
					public_description: child.data.sr_detail.public_description,
					title: child.data.sr_detail.title
				}
			} as Listing;
		})
	};

	return subredditFeedData;
};
