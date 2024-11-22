type RedditListingCommentsDataWrapper = [
	RedditListing<RedditT3DataWrapper>,
	RedditListing<RedditT1DataWrapper>
];

type RedditT1DataWrapper = {
	kind: 't1';
	data: RedditT1Data;
};

type RedditMoreDataWrapper = {
	kind: 'more';
	data: RedditMoreData;
};

type RedditT1Data = RedditListingBaseData & {
	subreddit_id: string;
	approved_at_utc: null;
	author_is_blocked: boolean;
	comment_type: null;
	awarders: any[];
	mod_reason_by: null;
	banned_by: null;
	author_flair_type: string;
	author_flair_template_id: null;
	likes: null;
	replies?: RedditListing<RedditT1DataWrapper | RedditMoreDataWrapper>;
	user_reports: any[];
	id: string;
	banned_at_utc: null;
	mod_reason_title: null;
	collapsed_reason_code: null;
	no_follow: boolean;
	parent_id: string;
	approved_by: null;
	mod_note: null;
	all_awardings: any[];
	collapsed: boolean;
	body: string;
	top_awarded_type: null;
	author_flair_css_class: null;
	is_submitter: boolean;
	downs: number;
	author_flair_richtext: any[];
	author_patreon_flair: boolean;
	body_html: string;
	removal_reason: null;
	collapsed_reason: null;
	distinguished: 'moderator' | string | undefined;
	associated_award: null;
	stickied: boolean;
	gildings: Record<string, any>;
	unrepliable_reason: null;
	author_flair_text_color: string | undefined;
	score_hidden: boolean;
	report_reasons: null;
	created: number;
	author_flair_text: null;
	treatment_tags: any[];
	link_id: string;
	controversiality: number;
	depth: number;
	author_flair_background_color: string | undefined;
	collapsed_because_crowd_control: null;
	mod_reports: any[];
	num_reports: null;
};

type RedditMoreData = {
	count: number;
	name: string;
	id: string;
	parent_id: string;
	depth: number;
	children: string[];
};
