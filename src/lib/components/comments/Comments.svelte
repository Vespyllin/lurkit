<script lang="ts">
	import { assignCommentState } from '.';
	import CommentContainer from './CommentContainer.svelte';

	const { comments, fold }: { comments: RedditListing<RedditT1DataWrapper>; fold?: boolean } =
		$props();

	let commentState = $state(assignCommentState(comments, fold));
</script>

<CommentContainer bind:comments={commentState} />
