export const cleanListing = (post: RedditT3Data): ListingData => {
	const {
		title,
		author,
		created_utc,
		edited,
		locked,
		upvote_ratio,
		score,
		over_18,
		num_comments,
		permalink,
		post_hint,
		is_gallery,
		is_self,
		is_video,
		crosspost_parent_list,
		crosspost_parent,
		thumbnail,
		url,
		gallery_data,
		selftext_html,
		name,
		media_metadata,
		link_flair_richtext,
		link_flair_background_color,
		secure_media,
		secure_media_embed,
		sr_detail,
		removed_by_category,
		stickied
	} = post;

	const crosspost = crosspost_parent_list?.find((x) => x.name == crosspost_parent);

	return {
		title: title,
		author: author,
		created_utc: created_utc,
		edited: edited,
		locked: locked,
		upvote_ratio: upvote_ratio,
		score: score,
		over_18: over_18,
		stickied: stickied,
		num_comments: num_comments,
		removed_by: removed_by_category,

		permalink: permalink,
		post_hint: post_hint,
		is_gallery: is_gallery,
		is_self: is_self,
		is_video: is_video,
		crosspost: crosspost ? cleanListing(crosspost) : undefined,
		thumbnail: thumbnail,
		url: url,
		gallery_data: gallery_data,
		selftext: selftext_html,

		name: name,
		media_metadata: media_metadata,
		link_flair_richtext: link_flair_richtext,
		link_flair_background_color: link_flair_background_color,
		secure_media: secure_media,
		secure_media_embed: secure_media_embed,

		subreddit: {
			community_icon: sr_detail?.community_icon ?? '',
			description: sr_detail?.description ?? '',
			display_name: sr_detail?.display_name_prefixed ?? '',
			over_18: sr_detail?.over_18 ?? false,
			icon_img: sr_detail?.icon_img ?? '',
			public_description: sr_detail?.public_description ?? '',
			title: sr_detail?.title ?? ''
		}
	};
};
