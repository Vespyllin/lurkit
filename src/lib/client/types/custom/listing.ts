type ListingData = {
	author: string;
	num_comments: number;
	created_utc: number;
	title: string;
	subreddit: SubredditDetails;
	selftext: string;
	permalink: string;
	url: string;
	thumbnail: string;
	over_18: boolean;

	post_hint: string;
	is_video: boolean;
	is_gallery: boolean;

	media_metadata: any;
	gallery_data?: { items: { media_id: string }[] };

	name: string;
	upvote_ratio: number;
	secure_media?: null;
	score: number;

	edited: boolean;
	is_self: boolean;

	secure_media_embed: {
		content: string;
		width: number;
		height: number;
		scrolling: boolean;
		media_domain_url: string;
	};
};

type SubredditDetails = {
	community_icon: string;
	description: string;
	display_name: string;
	over_18: boolean;
	public_description: string;
	icon_img: string | undefined;
	title: string;
};
