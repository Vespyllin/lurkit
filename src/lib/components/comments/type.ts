type CommentContentProps = {
	children: CommentContentProps[] | undefined;
	replyCount: number;
	collapsed: boolean;
	shelved: boolean;
	author_flairs?: RedditLinkFlairRichText[];
};
