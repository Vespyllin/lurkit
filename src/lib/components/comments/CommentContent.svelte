<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { ArrowUp, ChatBubble, PlusCircled } from 'radix-icons-svelte';
	import Markdown from '../ui/markdown/Markdown.svelte';

	const { comment = $bindable() }: { comment: CommentContentProps } = $props();
	const toggleCollapse = () => (comment.collapsed = !comment.collapsed);
	const showMoreComments = () => (comment.shelve = false);
</script>

<div class="border-l-2 pl-3 text-base hover:border-blue-400 lg:text-lg">
	<div class="mb-0.5 flex cursor-pointer gap-2" onclick={toggleCollapse}>
		<span class={cn('font-medium text-blue-500', comment.is_submitter && 'underline')}>
			{comment.author}
		</span>

		<span>•</span>

		<div class="flex items-center text-zinc-400">
			<ArrowUp />
			{comment.score.toLocaleString()}
		</div>

		{#if comment.totalChildren}
			<span>•</span>
			<div class="flex items-center gap-1 text-zinc-400">
				<ChatBubble />
				{comment.totalChildren.toLocaleString()}
			</div>
		{/if}

		<span>•</span>
		<div class="inline">
			<span class="text-zinc-400">{getTimeAgo(comment.created_utc, true)}</span>
			{#if typeof comment.edited == 'number'}
				<span class="text-zinc-400 lg:hidden">*</span>
			{/if}
		</div>

		{#if typeof comment.edited == 'number'}
			<span class="hidden lg:inline">•</span>
			<span class="hidden text-zinc-400 lg:inline">*{getTimeAgo(comment.edited, true)}</span>
		{/if}
	</div>

	{#if !comment.collapsed}
		<div class="mb-2 max-w-[calc(100lvw-3rem)]">
			<Markdown class="text-base lg:[&_*]:text-lg" text={comment.text} />
		</div>

		{#if !comment.shelve && comment.children?.length}
			<div class="space-y-4 lg:pl-3">
				{#each comment.children ?? [] as _, idx}
					<svelte:self bind:comment={comment.children![idx]} />
				{/each}
			</div>
		{:else if comment.shelve && comment.children?.length}
			<div
				class="flex w-full cursor-pointer items-center gap-2 pl-3 text-zinc-400 hover:underline lg:w-fit"
				onclick={showMoreComments}
			>
				<PlusCircled size={18} />
				<span>Expand {comment.children.length.toLocaleString()} more</span>
			</div>
		{/if}
	{/if}
</div>
