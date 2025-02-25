<script lang="ts">
	import { assignCommentState } from '.';
	import Comments from './Comments.svelte';

	const { comments }: { comments: RedditListing<RedditT1DataWrapper> } = $props();

	let commentState = $state(assignCommentState(comments));
</script>

<Comments bind:comments={commentState} />
