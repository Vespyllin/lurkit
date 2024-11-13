type PostData = {
	listing: ListingData;
	comments: PostComment[];
};

type PostComment = {
	text: string;
	score?: number;
	author: string;
	is_submitter: boolean;
	created_utc: number;
	edited: boolean | number;
	locked: boolean;
	stickied: boolean;
	distinguished?: 'moderator' | string;
	children?: PostComment[];
};
