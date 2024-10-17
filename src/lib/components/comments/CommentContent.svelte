<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { ArrowUp, ChatBubble, DrawingPin, PlusCircled } from 'radix-icons-svelte';
	import Self from './CommentContent.svelte';
	import Markdown from '../ui/markdown/Markdown.svelte';
	import { PUBLIC_TRUNCATED_COMMENT_LENGTH } from '$env/static/public';

	const {
		comment = $bindable(),
		class: className
	}: { comment: CommentContentProps; class?: string } = $props();

	const TRUNCATED_COMMENT_LENGTH = parseInt(PUBLIC_TRUNCATED_COMMENT_LENGTH);
	const truncatedLength = !isNaN(TRUNCATED_COMMENT_LENGTH) ? TRUNCATED_COMMENT_LENGTH : 1;
	let truncated = $state(true);

	const toggleCollapse = () => (comment.collapsed = !comment.collapsed);

	const showMoreComments = (comment: CommentContentProps) => {
		comment.shelved = false;
		// Display nested comments for 1 reply threads
		if (comment.children && comment.children.length == 1) showMoreComments(comment.children[0]);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={cn('border-l-2 pl-3 text-base hover:border-blue-400', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="cursor-pointer text-lg leading-tight" onclick={toggleCollapse}>
		<!-- Desktop -->
		<div class="hidden gap-2 lg:flex">
			<div class={cn('text-blue-500', comment.is_submitter && 'underline')}>
				{comment.author}
			</div>

			<span class="hidden lg:inline">•</span>

			<div class="flex items-center text-zinc-400">
				<ArrowUp />
				{comment.score.toLocaleString()}
			</div>

			{#if comment.replyCount}
				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					{comment.replyCount.toLocaleString()}
				</div>
			{/if}

			{#if comment.stickied}
				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<DrawingPin />
					<span class="text-zinc-400">stickied</span>
				</div>
			{/if}

			<span>•</span>
			<span class="text-zinc-400"
				>{getTimeAgo(comment.created_utc)}{#if comment.edited}
					*
				{/if}</span
			>
		</div>

		<!-- Mobile -->
		<div class="flex gap-1.5 lg:hidden">
			<div class={cn('text-blue-500', comment.is_submitter && 'underline')}>
				{comment.author}
			</div>

			{#if comment.stickied}
				<div class="my-auto text-zinc-400">
					<DrawingPin />
				</div>
			{/if}

			<span>•</span>
			<span class="text-zinc-400"
				>{getTimeAgo(comment.created_utc, true)}{#if comment.edited}
					*
				{/if}
			</span>
		</div>
	</div>

	{#if !comment.collapsed}
		<div class="mt-2 min-h-4 max-w-[calc(100lvw-3rem)]">
			<Markdown class="text-wrap break-words text-base text-zinc-200" text={comment.text} />

			<!-- Mobile -->
			<div class="mt-1 flex gap-4 lg:hidden">
				<div class="flex items-center text-zinc-400">
					<ArrowUp />
					{comment.score.toLocaleString()}
				</div>

				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					{comment.replyCount.toLocaleString()}
				</div>
			</div>
		</div>

		{#if !comment.shelved && !!comment.children && comment.children.length > 0}
			<div class="mt-3 space-y-4">
				{#each comment.children as _, idx}
					{#if !truncated || idx < truncatedLength}
						<Self class="lg:ml-2" bind:comment={comment.children![idx]} />
					{/if}
				{/each}
				{#if truncated && comment.children.length > truncatedLength}
					<button
						class="mt-2 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
						onclick={() => (truncated = false)}
					>
						<PlusCircled size={18} />
						<span>Expand {(comment.children.length - truncatedLength).toLocaleString()} more</span>
					</button>
				{/if}
			</div>
		{:else if comment.shelved && comment.children?.length}
			<button
				class="mt-2 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
				onclick={() => showMoreComments(comment)}
			>
				<PlusCircled size={18} />
				<span>Expand {comment.children.length.toLocaleString()} more</span>
			</button>
		{/if}
	{/if}
</div>
