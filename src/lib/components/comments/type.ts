type CommentContentProps = Omit<PostComment, 'children'> & {
	children: CommentContentProps[] | undefined;
	totalChildren: number;
	collapsed: boolean;
	shelved: boolean;
};
