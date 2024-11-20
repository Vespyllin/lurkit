import { PUBLIC_FOLD_COMMENT_DEPTH } from '$env/static/public';
import Comments from './Comments.svelte';

const FOLDED_COMMENT_DEPTH = parseInt(PUBLIC_FOLD_COMMENT_DEPTH);
const foldedDepth = !isNaN(FOLDED_COMMENT_DEPTH) ? FOLDED_COMMENT_DEPTH : 1;

export const assignCommentState = (
	parent: RedditListing<RedditT1DataWrapper | RedditMoreDataWrapper>
): CommentsProps[] => {
	if (!parent.data?.children) return [];
	const comments = parent.data.children;

	return comments.map((comment) => {
		if (comment.kind == 'more') {
			const { id, parent_id, depth, children, count } = comment.data;
			return { kind: comment.kind, id, parent_id, depth, children, count };
		}

		const {
			author,
			author_flair_richtext,
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
			replies
		} = comment.data;

		return {
			kind: comment.kind,
			author,
			author_flair_richtext,
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
			folded: depth >= foldedDepth,
			replies: replies ? assignCommentState(replies) : []
		};
	});
};

export default Comments;
