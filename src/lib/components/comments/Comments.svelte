<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import CommentSortDropdown from './CommentSortDropdown.svelte';
	import CommentContent from './CommentContent.svelte';
	import { PUBLIC_COLLAPSE_COMMENT_DEPTH as PUBLIC_SHELVE_COMMENT_DEPTH } from '$env/static/public';

	const SHELVE_COMMENT_DEPTH = parseInt(PUBLIC_SHELVE_COMMENT_DEPTH);
	const shelveDepth = !isNaN(SHELVE_COMMENT_DEPTH) ? SHELVE_COMMENT_DEPTH : 1;
	let {
		comments,
		error,
		fetching,
		sort = $bindable(),
		class: className
	}: {
		comments: PostComment[];
		sort: RedditSortOptions;
		error: string | undefined;
		fetching: boolean;
		class?: string;
	} = $props();

	const assignCommentState = (
		originalComments: PostComment[],
		depth: number = 0
	): CommentContentProps[] => {
		return originalComments.map((originalComment) => {
			const childrenWithState = originalComment.children?.length
				? assignCommentState(originalComment.children, depth + 1)
				: undefined;

			const subCommentCount =
				(originalComment.children?.length ?? 0) +
				(childrenWithState?.reduce((acc, v) => acc + v.totalChildren, 0) ?? 0);

			return {
				...originalComment,
				depth: depth,
				collapsed: false,
				children: childrenWithState,
				totalChildren: subCommentCount,
				shelve: depth >= shelveDepth
			} as CommentContentProps;
		});
	};

	const commentsWithState = $state(assignCommentState(comments));
</script>

<div class={className}>
	<CommentSortDropdown bind:sort />

	<Separator class="my-2" />

	{#if fetching}
		<FetchStatus {fetching} {error} />
	{:else}
		<div class="mt-3 space-y-4">
			{#each commentsWithState as _, idx}
				<CommentContent bind:comment={commentsWithState[idx]} />
			{/each}
		</div>
	{/if}
</div>
