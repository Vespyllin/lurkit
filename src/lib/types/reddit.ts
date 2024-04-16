type RedditListing = {
	kind: 'Listing';
	data: {
		after?: string;
		dist: number;
		modhash?: string;
		geo_filter?: null;
		children: RedditListingChild[];
		enabled: boolean;
	};
	all_awardings?: RedditAward[];
	awarders?: string[];
	media_only: boolean;
	link_flair_template_id: string;
	can_gild: boolean;
	spoiler: boolean;
	locked: boolean;
	author_flair_text: string;
	treatment_tags?: string[];
	visited: boolean;
	removed_by?: string;
	mod_note?: string;
	distinguished?: null;
	subreddit_id: string;
	author_is_blocked: boolean;
	mod_reason_by?: string;
	num_reports?: number;
	removal_reason?: string;
	link_flair_background_color: string;
	id: string;
	is_robot_indexable: boolean;
	report_reasons?: string[];
	author: string;
	discussion_type?: null;
	num_comments: number;
	send_replies: boolean;
	whitelist_status: string;
	contest_mode: boolean;
	mod_reports?: string[];
	author_patreon_flair: boolean;
	author_flair_text_color: string;
	permalink: string;
	parent_whitelist_status: string;
	stickied: boolean;
	url: string;
	subreddit_subscribers: number;
	created_utc: number;
	num_crossposts: number;
	media?: any;
	is_video: boolean;
};

type RedditAward = {
	// Award object structure can be added here if needed
};

type RedditListingChild = {
	kind: 't3';
	data: RedditListingData & { sr_detail: RedditSrDetail };
};

type RedditListingData = {
	is_video: boolean;
	is_gallery: boolean;
	permalink: string;
	url: string;
	num_comments: number;
	media_metadata: any;
	gallery_data?: {
		items: {
			media_id: string;
		}[];
	};
	approved_at_utc?: null;
	subreddit: string;
	selftext: string;
	author_fullname: string;
	saved: boolean;
	mod_reason_title?: null;
	gilded: number;
	clicked: boolean;
	title: string;
	link_flair_richtext: RedditLinkFlairRichText[];
	subreddit_name_prefixed: string;
	hidden: boolean;
	pwls: number;
	link_flair_css_class: string;
	downs: number;
	thumbnail_height: number;
	top_awarded_type?: null;
	hide_score: boolean;
	name: string;
	quarantine: boolean;
	link_flair_text_color: string;
	upvote_ratio: number;
	author_flair_background_color?: null;
	ups: number;
	total_awards_received: number;
	media_embed: {};
	thumbnail_width: number;
	author_flair_template_id: string;
	is_original_content: boolean;
	user_reports?: string[];
	secure_media?: null;
	is_reddit_media_domain: boolean;
	is_meta: boolean;
	category?: null;
	secure_media_embed: {};
	link_flair_text: string;
	can_mod_post: boolean;
	score: number;
	approved_by?: null;
	is_created_from_ads_ui: boolean;
	author: string;
	created_utc: number;
	author_premium: boolean;
	thumbnail: string;
	edited: boolean;
	author_flair_css_class?: null;
	author_flair_richtext: RedditAuthorFlairRichText[];
	gildings: {};
	post_hint: string;
	content_categories?: null;
	is_self: boolean;
	subreddit_type: string;
	created: number;
	link_flair_type: string;
	wls: number;
	removed_by_category?: null;
	banned_by?: null;
	author_flair_type: string;
	domain: string;
	allow_live_comments: boolean;
	selftext_html?: null;
	likes?: null;
	suggested_sort?: null;
	banned_at_utc?: null;
	url_overridden_by_dest: string;
	view_count?: null;
	archived: boolean;
	no_follow: boolean;
	is_crosspostable: boolean;
	pinned: boolean;
	over_18: boolean;
	preview?: {
		images: RedditPreviewImage[];
		variants: {};
		id: string;
	};
};

type RedditLinkFlairRichText = {
	a?: string;
	e: 'emoji' | 'text';
	u?: string;
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
	allowed_media_in_comments: any[]; // Depending on the actual content, you might want to specify a type Reddithere
	user_is_banned: null | boolean;
	free_form_reports: boolean;
	community_icon: string;
	show_media: boolean;
	description: string;
	user_is_muted: null | boolean;
	display_name: string;
	header_img: string | null;
	title: string;
	previous_names: any[]; // Depending on the actual content, you might want to specify a type Reddithere
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
