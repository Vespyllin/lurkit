type SubredditData = {
	display_name: string;
	title: string;
	primary_color: string;
	active_user_count: number;
	icon_img: string;
	accounts_active: number;
	public_traffic: boolean;
	subscribers: number;

	name: string;
	quarantine: boolean;

	public_description: string;

	comment_score_hide_mins: number;
	community_icon?: string;

	banner_background_image: string;
	banner_background_color: string;

	key_color: string;

	subreddit_type: 'public' | string;

	id: string;

	over18: boolean;
	header_title: string;
	description: string;

	restrict_commenting: boolean;

	lang: string;

	created_utc: number;

	mobile_banner_image: string;
};
