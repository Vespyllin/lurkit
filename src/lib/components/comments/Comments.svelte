<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import CommentSortDropdown from './CommentSortDropdown.svelte';
	import CommentContent from './CommentContent.svelte';

	let {
		comments = $bindable(),
		sort = $bindable(),
		error,
		fetching,
		class: className
	}: {
		comments: CommentContentProps[];
		sort: RedditCommentSortOptions;
		error: string | undefined;
		fetching: boolean;
		class?: string;
	} = $props();
</script>

<div class={className}>
	<CommentSortDropdown bind:sort />

	<Separator class="my-2" />

	{#if fetching}
		<FetchStatus {fetching} {error} />
	{:else}
		<div class="mt-3 space-y-4 pb-3">
			{#each comments as _, idx}
				<CommentContent bind:comment={comments[idx]} />
			{/each}
			{#if comments.length == 0}
				<span class="text-2xl text-zinc-400">No comments to display...</span>
			{/if}
		</div>
	{/if}
</div>
