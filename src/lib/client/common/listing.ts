export const cleanListing = (post: RedditListingChildData): ListingData => {
	return {
		author: post.author,
		created_utc: post.created_utc,
		edited: post.edited,
		is_gallery: post.is_gallery,
		is_self: post.is_self,
		is_video: post.is_video,
		name: post.name,
		title: post.title,
		media_metadata: post.media_metadata,
		num_comments: post.num_comments,
		permalink: post.permalink,
		post_hint: post.post_hint,
		score: post.score,
		secure_media_embed: post.secure_media_embed,
		selftext: post.selftext,
		over_18: post.over_18,
		link_flair_richtext: post.link_flair_richtext,
		subreddit: {
			community_icon: post.sr_detail?.community_icon ?? '',
			description: post.sr_detail?.description ?? '',
			display_name: post.sr_detail?.display_name_prefixed ?? '',
			over_18: post.sr_detail?.over_18 ?? false,
			icon_img: post.sr_detail?.icon_img ?? '',
			public_description: post.sr_detail?.public_description ?? '',
			title: post.sr_detail?.title ?? ''
		},
		thumbnail: post.thumbnail,
		upvote_ratio: post.upvote_ratio,
		url: post.url,
		gallery_data: post.gallery_data,
		secure_media: post.secure_media,
		locked: post.locked
	};
};
