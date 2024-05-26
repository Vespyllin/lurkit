<script lang="ts">
	import { cn } from '$lib/utils';
	import { PlusCircled } from 'radix-icons-svelte';
	import CommentContent from './CommentContent.svelte';
	import { PUBLIC_COLLAPSE_COMMENT_DEPTH } from '$env/static/public';

	const {
		comments,
		depth = 0,
		root
	}: { comments: PostComments; depth?: number; root?: boolean } = $props();

	const exceededCollapseDepth = depth == parseInt(PUBLIC_COLLAPSE_COMMENT_DEPTH ?? '1');
	let collapsed = $state(exceededCollapseDepth);
	const collapse = () => (collapsed = !collapsed);
</script>

<div class={cn('mt-1 flex flex-col', root ? 'gap-4' : 'gap-2.5')}>
	{#if !collapsed || comments.length == 0}
		{#each comments as comment, idx}
			<CommentContent
				{comment}
				depth={exceededCollapseDepth ? 0 : depth}
				collapsed={exceededCollapseDepth && idx > 0}
			/>
		{/each}
	{:else}
		<div
			class="flex cursor-pointer items-center gap-2 text-zinc-400 hover:underline"
			onclick={collapse}
		>
			<PlusCircled size={18} />
			<span>Expand {comments.length} more</span>
		</div>
	{/if}
</div>
