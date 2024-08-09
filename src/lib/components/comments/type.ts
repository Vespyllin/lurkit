type CommentContentProps = Omit<PostComment, 'children'> & {
	children: CommentContentProps[] | undefined;
	replyCount: number;
	collapsed: boolean;
	shelved: boolean;
};
