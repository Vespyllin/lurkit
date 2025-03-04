<script lang="ts">
	import { assignCommentState } from '.';
	import CommentContainer from './CommentContainer.svelte';

	const { comments }: { comments: RedditListing<RedditT1DataWrapper> } = $props();

	let commentState = $state(assignCommentState(comments));
</script>

<CommentContainer bind:comments={commentState} />
