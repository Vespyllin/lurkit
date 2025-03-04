import { PUBLIC_FOLD_COMMENT_DEPTH } from '$env/static/public';

const FOLDED_COMMENT_DEPTH = parseInt(PUBLIC_FOLD_COMMENT_DEPTH);
const foldedDepth = !isNaN(FOLDED_COMMENT_DEPTH) ? FOLDED_COMMENT_DEPTH : 1;

export const validateCommentSort = (sortString: string | null) => {
	const validSortOptions = [
		'confidence',
		'top',
		'new',
		'controversial',
		'old',
		'random',
		'qa',
		'blank'
	];

	const isValid = !!sortString && validSortOptions.includes(sortString);

	return isValid ? (sortString as RedditCommentSortOption) : 'blank';
};

export const assignCommentState = (
	parent: RedditListing<RedditT1DataWrapper | RedditMoreDataWrapper>,
	foldingEnabled: boolean = true
): CommentsProp[] => {
	if (!parent.data?.children) return [];
	const comments = parent.data.children;

	return comments.map((comment, idx) => {
		if (comment.kind == 'more') {
			const { id, parent_id, depth, children, count } = comment.data;
			return { kind: comment.kind, id, parent_id, depth, children, count };
		}

		const {
			author,
			author_flair_richtext,
			author_flair_background_color,
			archived,
			body_html,
			created_utc,
			depth,
			distinguished,
			edited,
			id,
			is_submitter,
			locked,
			parent_id,
			permalink,
			score,
			score_hidden,
			stickied,
			subreddit,
			subreddit_name_prefixed,
			replies,
			removal_reason
		} = comment.data;

		return {
			kind: comment.kind,
			author,
			author_flair_richtext,
			author_flair_background_color,
			archived,
			body_html,
			created_utc,
			depth,
			distinguished,
			edited,
			id,
			is_submitter,
			locked,
			parent_id,
			permalink,
			score,
			score_hidden,
			stickied,
			subreddit,
			subreddit_name_prefixed,
			deleted: !!removal_reason ? (removal_reason == 'legal' ? 'removed' : 'deleted') : undefined,
			__reason: !!removal_reason,
			folded:
				foldingEnabled &&
				((idx >= 4 && depth != 0) || depth >= foldedDepth || (stickied && depth == 0)),
			replies: replies ? assignCommentState(replies, foldingEnabled) : []
		};
	});
};
