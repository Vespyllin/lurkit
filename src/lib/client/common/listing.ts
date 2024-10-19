export const cleanListing = (post: RedditT3Data): ListingData => {
	const crosspost = post.crosspost_parent_list?.find((x) => x.name == post.crosspost_parent);

	return {
		title: post.title,
		author: post.author,
		created_utc: post.created_utc,
		edited: post.edited,
		locked: post.locked,
		upvote_ratio: post.upvote_ratio,
		score: post.score,
		over_18: post.over_18,
		num_comments: post.num_comments,

		permalink: post.permalink,
		post_hint: post.post_hint,
		is_gallery: post.is_gallery,
		is_self: post.is_self,
		is_video: post.is_video,
		crosspost: crosspost ? cleanListing(crosspost) : undefined,
		thumbnail: post.thumbnail,
		url: post.url,
		gallery_data: post.gallery_data,
		selftext: post.selftext,

		name: post.name,
		media_metadata: post.media_metadata,
		link_flair_richtext: post.link_flair_richtext,
		secure_media: post.secure_media,
		secure_media_embed: post.secure_media_embed,

		subreddit: {
			community_icon: post.sr_detail?.community_icon ?? '',
			description: post.sr_detail?.description ?? '',
			display_name: post.sr_detail?.display_name_prefixed ?? '',
			over_18: post.sr_detail?.over_18 ?? false,
			icon_img: post.sr_detail?.icon_img ?? '',
			public_description: post.sr_detail?.public_description ?? '',
			title: post.sr_detail?.title ?? ''
		}
	};
};
