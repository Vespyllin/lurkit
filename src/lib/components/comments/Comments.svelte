<script lang="ts">
	import { assignCommentState } from '.';
	import CommentContainer from './CommentContainer.svelte';

	const { comments, shelve }: { comments: RedditListing<RedditT1DataWrapper>; shelve?: boolean } =
		$props();

	let commentState = $state(assignCommentState(comments));
</script>

<CommentContainer bind:comments={commentState} shelved={shelve} />
