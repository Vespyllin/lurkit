import { PUBLIC_MOCK } from '$env/static/public';
import feed from '../../../../static/feed.json';

export const subredditClient = () => {
	const fetchData = async (subreddit?: string, count?: number, after?: string) => {
		const baseURL = 'https://www.reddit.com';
		const queryParams = '?limit=100&sr_detail=1';
		const formattedSubreddit = subreddit ? `r/${subreddit}` : '';

		if (PUBLIC_MOCK == 'true') {
			console.log('Mock request for feed.json');
			return { data: reduce(feed as any) };
		}

		const url = `${baseURL}/${formattedSubreddit}.json${queryParams}`;

		const fetchRes = await fetch(url);
		if (fetchRes.status == 403) {
			return {
				data: [],
				reason: 'Status 403: Access Denied.\nYou were most likely rate limited, try again later.'
			};
		} else if (fetchRes.status != 200) {
			return {
				data: [],
				reason: `Not OK, status ${fetchRes.status}`
			};
		}

		const fetchData: RedditListing = await fetchRes.json();

		const subredditFeedData = reduce(fetchData);

		return { data: subredditFeedData };
	};

	const reduce = (feed: RedditListing) => {
		const subredditFeedData: SubredditFeedData = {
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

					subreddit: {
						display_name: child.data.sr_detail.display_name_prefixed,
						community_icon: child.data.sr_detail.community_icon,
						description: child.data.sr_detail.description,
						over_18: child.data.sr_detail.over_18,
						icon_img: child.data.sr_detail.icon_img ?? child.data.sr_detail.community_icon
					}
				} as Listing;
			})
		};

		return subredditFeedData;
	};

	return { fetchData };
};
