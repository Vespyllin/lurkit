<script lang="ts">
	import { cleanText, getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import {
		ArrowUp,
		ChatBubble,
		DrawingPin,
		PlusCircled,
		MagicWand,
		LockClosed,
		VercelLogo
	} from 'radix-icons-svelte';
	import Self from './Comments.svelte';
	import Markdown from '../media/Markdown.svelte';
	import { PUBLIC_FOLD_COMMENT_DEPTH, PUBLIC_SHELF_COMMENT_LENGTH } from '$env/static/public';

	const {
		comment = $bindable(),
		class: className
	}: { comment: RedditT1DataWrapper; class?: string } = $props();

	const FOLDED_COMMENT_DEPTH = parseInt(PUBLIC_FOLD_COMMENT_DEPTH);
	const foldedDepth = !isNaN(FOLDED_COMMENT_DEPTH) ? FOLDED_COMMENT_DEPTH : 1;

	const SHELF_COMMENT_DEPTH = parseInt(PUBLIC_SHELF_COMMENT_LENGTH);
	const shelfDepth = !isNaN(SHELF_COMMENT_DEPTH) ? SHELF_COMMENT_DEPTH : 1;

	let shelved = $state(true);
	let folded = $state(comment.data.depth >= foldedDepth);

	const toggleFolded = () => (folded = !folded);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={cn('border-l-2 pl-3 text-base hover:border-accent', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="flex h-fit cursor-pointer items-center gap-1.5 text-lg leading-tight lg:gap-2"
		onclick={toggleFolded}
	>
		<span
			class={cn('flex items-center gap-1 text-primary', comment.data.is_submitter && 'underline')}
		>
			<span>{comment.data.author}</span>
			{#if comment.data.distinguished}
				{#if comment.data.distinguished == 'moderator'}
					<MagicWand />
				{:else if comment.data.distinguished == 'admin'}
					<VercelLogo />
				{:else}
					<span class="capitalize">
						({comment.data.distinguished})
					</span>
				{/if}
			{/if}
		</span>

		{#if !comment.data.score_hidden}
			<span class="hidden lg:inline">•</span>
			<div class="hidden items-center text-zinc-400 lg:flex">
				<ArrowUp />
				<span>{comment.data.score.toLocaleString()}</span>
			</div>
		{/if}

		<span class="hidden lg:inline">•</span>
		<div class="hidden items-center gap-1 text-zinc-400 lg:flex">
			<ChatBubble />

			{#if comment.data.replies?.data?.children || !comment.data.locked}
				<span>{(comment.data.replies?.data?.children?.length ?? 0).toLocaleString()}</span>
			{/if}
			{#if comment.data.locked}
				<LockClosed />
			{/if}
		</div>

		{#if comment.data.stickied}
			<span class="hidden lg:inline">•</span>
			<div class="flex items-center gap-1 text-zinc-400">
				<DrawingPin />
				<span class="hidden text-zinc-400 lg:inline">stickied</span>
			</div>
		{/if}

		<span>•</span>
		<div class="text-zinc-400">
			<span class="hidden lg:inline">
				{getTimeAgo(comment.data.created_utc)}
			</span><span class="inline lg:hidden">
				{getTimeAgo(comment.data.created_utc, true)}
			</span>{#if comment.data.edited}<span>*</span>{/if}
		</div>

		{#if comment.data.author_flair_richtext && comment.data.author_flair_richtext.length > 0}
			<div
				class="flex h-full w-fit items-center gap-1 rounded-2xl bg-secondary px-2 py-0.5 text-sm"
			>
				{#each comment.data.author_flair_richtext as flair}
					{#if flair.e == 'text'}
						{cleanText(flair.t!)}
					{:else if flair.e == 'emoji'}
						<img alt="" src={flair.u} class="h-4 px-0.5" />
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	{#if !folded}
		<div class="mt-2 min-h-4 max-w-[calc(100lvw-3rem)]">
			<div class="text-wrap break-words text-base text-zinc-200">
				<Markdown text={comment.data.body_html} />
			</div>

			<!-- Mobile -->
			<div class="mt-1 flex gap-4 lg:hidden">
				{#if comment.data.score}
					<div class="flex items-center text-zinc-400">
						<ArrowUp />
						<span>{comment.data.score.toLocaleString()}</span>
					</div>
				{/if}

				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					{#if !comment.data.replies?.data?.children?.length || !comment.data.locked}
						<span>{(comment.data.replies?.data?.children?.length ?? 0).toLocaleString()}</span>
					{/if}
					{#if comment.data.locked}
						<LockClosed />
					{/if}
				</div>
			</div>
		</div>

		{#if comment.data.replies?.data?.children?.length}
			{@const children = comment.data.replies.data.children}
			<div class="mt-3 space-y-4">
				{#each children as _, idx}
					{#if comment.data.replies.data.children[idx].kind !== 'more'}
						{#if idx < shelfDepth || !shelved}
							<Self class="lg:ml-2" bind:comment={comment.data.replies.data.children[idx]} />
						{/if}
					{/if}
				{/each}
				{#if children.length > shelfDepth + 1 && shelved}
					<button
						class="mt-2 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
						onclick={() => (shelved = false)}
					>
						<PlusCircled size={18} />
						<span> Expand {(children.length - shelfDepth - 1).toLocaleString()} more</span>
					</button>
				{/if}
			</div>
		{/if}
	{/if}
</div>
