<script lang="ts">
	import { cleanText, getTimeAgo, isDarkHex } from '$lib';
	import { cn } from '$lib/utils';
	import {
		ArrowUp,
		ChatBubble,
		DrawingPin,
		PlusCircled,
		MagicWand,
		LockClosed,
		VercelLogo,
		ArrowRight
	} from 'radix-icons-svelte';
	import Self from './Comments.svelte';
	import Markdown from '../media/Markdown.svelte';
	import { PUBLIC_SHELF_COMMENT_LENGTH } from '$env/static/public';
	import { page } from '$app/stores';
	import UserPopover from '../users/UserPopover.svelte';

	const SHELF_COMMENT_DEPTH = parseInt(PUBLIC_SHELF_COMMENT_LENGTH);
	const shelfDepth = !isNaN(SHELF_COMMENT_DEPTH) ? SHELF_COMMENT_DEPTH : 1;

	const {
		comments = $bindable(),
		class: className,
		shelved: _shelved = true
	}: { comments: CommentsProp[]; class?: string; shelved?: boolean } = $props();

	let shelved = $state(_shelved);

	const {
		params: { subreddit, title, tag }
	} = $page;
</script>

<div>
	{#each comments as _, idx}
		{#if shelved && idx - 1 == shelfDepth && comments[idx].depth != 0}
			{@const hasMore = !!comments.find((x) => x.kind == 'more')}
			<button
				class="mt-1.5 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
				onclick={() => (shelved = false)}
			>
				<PlusCircled size={18} />
				<span>
					Expand {(comments.length - shelfDepth - +hasMore).toLocaleString()}{hasMore ? '+' : ''} more</span
				>
			</button>
		{:else if !shelved || idx < shelfDepth || comments[idx].depth == 0}
			<!-- ^ Hidden for base listing of comments as the "view more" functionality does not currently work -->
			{#if comments[idx].kind == 'more' && idx != 0}
				{@const parent_id = comments[idx].parent_id.split('_')[1]}
				<a
					href={`/r/${subreddit}/comments/${tag}/${title}/${parent_id}`}
					class="mt-1 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline md:w-fit"
				>
					<ArrowRight size={18} />
					<span>View {comments[idx].count} more comment{comments[idx].count == 1 ? '' : 's'}</span>
				</a>
			{:else if comments[idx].kind == 't1'}
				<div class={cn('mt-2.5 border-l-2 pl-3 text-base hover:border-accent', className)}>
					<button
						class="flex h-full w-full cursor-pointer items-center gap-1.5 text-lg leading-tight md:gap-2"
						onclick={() => {
							(comments[idx] as T1CommentProp).folded = !(comments[idx] as T1CommentProp).folded;
						}}
					>
						<span
							class={cn(
								'flex items-center gap-1 text-primary',
								comments[idx].is_submitter && 'underline'
							)}
						>
							<UserPopover username={comments[idx].author} />

							{#if comments[idx].distinguished}
								{#if comments[idx].distinguished == 'moderator'}
									<MagicWand />
								{:else if comments[idx].distinguished == 'admin'}
									<VercelLogo />
								{:else}
									<span class="capitalize">({comments[idx].distinguished})</span>
								{/if}
							{/if}
						</span>

						{#if !comments[idx].score_hidden}
							<span class="hidden md:inline">•</span>
							<div class="hidden items-center text-zinc-400 md:flex">
								<ArrowUp />
								<span>{comments[idx].score.toLocaleString()}</span>
							</div>
						{/if}

						<span class="hidden md:inline">•</span>
						<div class="hidden items-center gap-1 text-zinc-400 md:flex">
							<ChatBubble />

							{#if comments[idx].replies.length || !comments[idx].locked}
								<span>{(comments[idx].replies.length ?? 0).toLocaleString()}</span>
							{/if}
							{#if comments[idx].locked}
								<LockClosed />
							{/if}
						</div>

						{#if comments[idx].stickied}
							<span class="hidden md:inline">•</span>
							<div class="flex items-center gap-1 text-zinc-400">
								<DrawingPin />
								<span class="hidden text-zinc-400 md:inline">stickied</span>
							</div>
						{/if}

						<span>•</span>
						<div class="text-zinc-400">
							<span class="hidden md:inline">
								{getTimeAgo(comments[idx].created_utc)}
							</span><span class="inline md:hidden">
								{getTimeAgo(comments[idx].created_utc, true)}
							</span>{#if comments[idx].edited}<span>*</span>{/if}
						</div>

						{#if comments[idx].author_flair_richtext && comments[idx].author_flair_richtext.length > 0}
							<div
								class="flex h-full w-fit max-w-72 items-center rounded-2xl bg-secondary px-2 py-0.5 text-sm"
								style="background-color: {comments[idx].author_flair_background_color};"
							>
								{#each comments[idx].author_flair_richtext as flair}
									{#if flair.e == 'text'}
										<span
											class={cn(
												'overflow-hidden text-ellipsis whitespace-nowrap break-all [&:not(:first-child)]:ml-1.5',
												comments[idx].author_flair_background_color &&
													!isDarkHex(comments[idx].author_flair_background_color) &&
													'text-zinc-900'
											)}
										>
											{cleanText(flair.t!)}
										</span>
									{:else if flair.e == 'emoji'}
										<img alt="" src={flair.u} class="h-4" />
									{/if}
								{/each}
							</div>
						{/if}
					</button>

					{#if !comments[idx].folded}
						<!-- max-w-[calc(100lvw-3rem)] -->
						<div class="mt-1.5 min-h-4">
							<div class="text-wrap break-words text-base text-zinc-200">
								<Markdown text={comments[idx].body_html} />
							</div>

							<!-- Mobile -->
							<div class="mt-1 flex gap-4 md:hidden">
								{#if comments[idx].score}
									<div class="flex items-center text-zinc-400">
										<ArrowUp />
										<span>{comments[idx].score.toLocaleString()}</span>
									</div>
								{/if}

								<div class="flex items-center gap-1 text-zinc-400">
									<ChatBubble />
									{#if !comments[idx].replies.length || !comments[idx].locked}
										<span>{(comments[idx].replies.length ?? 0).toLocaleString()}</span>
									{/if}
									{#if comments[idx].locked}
										<LockClosed />
									{/if}
								</div>
							</div>
						</div>

						<Self class="md:ml-2" shelved={_shelved} bind:comments={comments[idx].replies} />
					{/if}
				</div>
			{/if}
		{/if}
	{/each}
</div>
