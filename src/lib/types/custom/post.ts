type PostData = {
	listing: Listing;
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
	children?: PostComments;
};
