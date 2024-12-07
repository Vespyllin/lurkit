type RedditT2DataWrapper = {
	kind: string;
	data: RedditT2Data;
};

type RedditT2Data = {
	is_employee: boolean;
	is_friend: boolean;
	subreddit: RedditUserSubreddit;
	snoovatar_size: [number, number];
	awardee_karma: number;
	id: string;
	verified: boolean;
	is_gold: boolean;
	is_mod: boolean;
	awarder_karma: number;
	has_verified_email: boolean;
	icon_img: string;
	hide_from_robots: boolean;
	link_karma: number;
	is_blocked: boolean;
	total_karma: number;
	pref_show_snoovatar: boolean;
	name: string;
	created: number;
	created_utc: number;
	snoovatar_img: string;
	comment_karma: number;
	accept_followers: boolean;
	has_subscribed: boolean;
};

type RedditUserSubreddit = {
	default_set: boolean;
	user_is_contributor: boolean | null;
	banner_img: string;
	allowed_media_in_comments: any[];
	user_is_banned: boolean | null;
	free_form_reports: boolean;
	community_icon: string | null;
	show_media: boolean;
	icon_color: string;
	user_is_muted: boolean | null;
	display_name: string;
	header_img: string | null;
	title: string;
	previous_names: string[];
	over_18: boolean;
	icon_size: [number, number];
	primary_color: string;
	icon_img: string;
	description: string;
	submit_link_label: string;
	header_size: number | null;
	restrict_posting: boolean;
	restrict_commenting: boolean;
	subscribers: number;
	submit_text_label: string;
	is_default_icon: boolean;
	link_flair_position: string;
	display_name_prefixed: string;
	key_color: string;
	name: string;
	is_default_banner: boolean;
	url: string;
	quarantine: boolean;
	banner_size: number | null;
	user_is_moderator: boolean | null;
	accept_followers: boolean;
	public_description: string;
	link_flair_enabled: boolean;
	disable_contributor_requests: boolean;
	subreddit_type: string;
	user_is_subscriber: boolean | null;
};

type RedditUserWrapper = {
	kind: 'listing';
	data: {
		after: string;
		dist: number;
		modhash: string;
		geo_filter: string;
		children: (RedditT1DataWrapper | RedditT3DataWrapper)[];
	};
};
