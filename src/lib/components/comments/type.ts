type CommentsProps =
	| {
			kind: 'more';
			id: string;
			parent_id: string;
			depth: number;
			children: string[];
			count: number;
	  }
	| {
			kind: 't1';
			author: string;
			author_flair_richtext: any[];
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
			replies: CommentsProps[];
	  };
