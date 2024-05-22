<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import CommentChain from './CommentChain.svelte';
	import CommentSortDropdown from './CommentSortDropdown.svelte';

	let {
		comments,
		error,
		fetching,
		class: className
	}: {
		comments: PostComments;
		error: string | undefined;
		fetching: boolean;
		class?: string;
	} = $props();

	let sort: RedditSortOptions = $state('top');
</script>

<div class={className}>
	<CommentSortDropdown bind:sort />

	<Separator class="my-2" />

	{#if fetching}
		<FetchStatus {fetching} {error} />
	{:else}
		<CommentChain {comments} root />
	{/if}
</div>
