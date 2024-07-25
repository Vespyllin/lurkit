<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import CommentSortDropdown from './CommentSortDropdown.svelte';
	import CommentContent from './CommentContent.svelte';
	import { PUBLIC_COLLAPSE_COMMENT_DEPTH } from '$env/static/public';

	const SHELVE_COMMENT_DEPTH = parseInt(PUBLIC_COLLAPSE_COMMENT_DEPTH);
	const shelveDepth = !isNaN(SHELVE_COMMENT_DEPTH) ? SHELVE_COMMENT_DEPTH : 1;

	let {
		comments = $bindable(),
		error,
		fetching,
		sort = $bindable(),
		class: className
	}: {
		comments: CommentContentProps[];
		sort: RedditSortOptions;
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
		<div class="mt-3 space-y-4">
			{#each comments as _, idx}
				<CommentContent bind:comment={comments[idx]} />
			{/each}
		</div>
	{/if}
</div>
