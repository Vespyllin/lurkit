<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { ArrowUp, ChatBubble, DrawingPin, PlusCircled } from 'radix-icons-svelte';
	import Self from './CommentContent.svelte';
	import Markdown from '../media/Markdown.svelte';
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
<div class={cn('border-l-2 pl-3 text-base hover:border-accent', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="flex cursor-pointer gap-1.5 text-lg leading-tight lg:gap-2" onclick={toggleCollapse}>
		<span class={cn('text-primary', comment.is_submitter && 'underline')}>
			{comment.author}
		</span>

		{#if comment.score}
			<span class="hidden lg:inline">•</span>
			<div class="hidden items-center text-zinc-400 lg:flex">
				<ArrowUp />
				<span>{comment.score.toLocaleString()}</span>
			</div>
		{/if}

		<span class="hidden lg:inline">•</span>
		<div class="hidden items-center gap-1 text-zinc-400 lg:flex">
			<ChatBubble />
			<span>{comment.replyCount.toLocaleString()}</span>
		</div>

		{#if comment.stickied}
			<span class="hidden lg:inline">•</span>
			<div class="flex items-center gap-1 text-zinc-400">
				<DrawingPin />
				<span class="hidden text-zinc-400 lg:inline">stickied</span>
			</div>
		{/if}

		<span>•</span>
		<div class="text-zinc-400">
			<span class="hidden lg:inline">
				{getTimeAgo(comment.created_utc)}
			</span><span class="inline lg:hidden">
				{getTimeAgo(comment.created_utc, true)}
			</span>{#if comment.edited}<span>*</span>{/if}
		</div>
	</div>

	{#if !comment.collapsed}
		<div class="mt-2 min-h-4 max-w-[calc(100lvw-3rem)]">
			<div class="text-wrap break-words text-base text-zinc-200">
				<Markdown text={comment.text} />
			</div>

			<!-- Mobile -->
			<div class="mt-1 flex gap-4 lg:hidden">
				{#if comment.score}
					<div class="flex items-center text-zinc-400">
						<ArrowUp />
						<span>{comment.score.toLocaleString()}</span>
					</div>
				{/if}

				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					<span>{comment.replyCount.toLocaleString()}</span>
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
						<span> Expand {(comment.children.length - truncatedLength).toLocaleString()} more</span>
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
