type MoreCommentProp = {
	kind: 'more';
	id: string;
	parent_id: string;
	depth: number;
	children: string[];
	count: number;
};

type T1CommentProp = {
	kind: 't1';
	author: string;
	author_flair_richtext: any[];
	author_flair_background_color: string | undefined;
	archived: boolean;
	body_html: string;
	created_utc: number;
	depth: number;
	distinguished?: 'moderator' | string;
	edited: boolean | number;
	id: string;
	is_submitter: boolean;
	locked: boolean;
	parent_id: string;
	permalink: string;
	score: number;
	score_hidden: boolean;
	stickied: boolean;
	subreddit: string;
	subreddit_name_prefixed: string;
	folded: boolean;
	replies: CommentsProp[];
	deleted: 'deleted' | 'removed' | undefined;
	__reason: any;
};

type CommentsProp = MoreCommentProp | T1CommentProp;
