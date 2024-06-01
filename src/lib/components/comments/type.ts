type CommentContentProps = Omit<PostComment, 'children'> & {
	children: CommentContentProps[] | undefined;
	totalChildren: number;
	collapsed: boolean;
	shelve: boolean;
};
