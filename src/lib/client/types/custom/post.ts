type PostData = {
	listing: ListingData;
	comments: PostComments;
};

type PostComments = PostComment[];

type PostComment = {
	text: string;
	score: number;
	author: string;
	is_submitter: boolean;
	created_utc: number;
	edited: boolean | number;
	stickied: boolean;
	children?: PostComments;
};
