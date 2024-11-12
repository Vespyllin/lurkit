type RedditCommentSortOptions = 'new' | 'controversial' | 'top' | 'hot' | 'random';
type RedditSubredditSortOptions = 'new' | 'top' | 'hot' | 'rising';

type RedditListing<InnerData> = {
	kind: 'Listing';
	data?: {
		after?: string;
		dist: number;
		modhash?: string;
		geo_filter?: null;
		children?: InnerData[];
		enabled: boolean;
	};
};

type RedditAward = never;

type RedditLinkFlairRichText = {
	a?: string;
	e: 'emoji' | 'text';
	u?: string;
	t?: string;
};

type RedditAuthorFlairRichText = RedditLinkFlairRichText;

type RedditPreviewImage = {
	source: {
		url: string;
		width: number;
		height: number;
	};
	resolutions: RedditPreviewImageResolution[];
	variants: {};
	id: string;
};

type RedditPreviewImageResolution = {
	url: string;
	width: number;
	height: number;
};

type RedditSrDetail = {
	default_set: boolean;
	banner_img: string;
	allowed_media_in_comments: any[];
	user_is_banned: null | boolean;
	free_form_reports: boolean;
	community_icon: string;
	show_media: boolean;
	description: string;
	user_is_muted: null | boolean;
	display_name: string;
	header_img: string | null;
	title: string;
	previous_names: any[];
	user_is_moderator: null | boolean;
	over_18: boolean;
	icon_size: number[];
	primary_color: string;
	icon_img?: string;
	icon_color: string;
	submit_link_label: string;
	header_size: null | string;
	restrict_posting: boolean;
	restrict_commenting: boolean;
	subscribers: number;
	submit_text_label: string;
	link_flair_position: string;
	display_name_prefixed: string;
	key_color: string;
	name: string;
	created: number;
	url: string;
	quarantine: boolean;
	created_utc: number;
	banner_size: null | string;
	user_is_contributor: null | boolean;
	accept_followers: boolean;
	public_description: string;
	link_flair_enabled: boolean;
	disable_contributor_requests: boolean;
	subreddit_type: string;
	user_is_subscriber: null | boolean;
};

type RedditListingBaseData = {
	subreddit: string;
	author_fullname: string;
	saved: boolean;
	gilded: number;
	name: string;
	permalink: string;
	locked: boolean;
	ups: number;
	total_awards_received: number;
	can_mod_post: boolean;
	score: number;
	created_utc: number;
	author: string;
	author_premium: boolean;
	edited: boolean | number;
	subreddit_name_prefixed: string;
	archived: boolean;
	no_follow: boolean;
	subreddit_type: string;
};
