<script lang="ts">
	import { ExclamationTriangle } from 'radix-icons-svelte';
	import { cleanText, getTimeAgo } from '$lib';
	import SubredditPopover from '../subreddit/SubredditPopover.svelte';

	let {
		subreddit,
		author,
		created_utc,
		over_18,
		flairs
	}: {
		subreddit?: SubredditDetails;
		author: string;
		created_utc: number;
		over_18: boolean;
		flairs?: RedditLinkFlairRichText[];
	} = $props();
</script>

<div class="flex h-5 items-center gap-2">
	{#if subreddit}
		<SubredditPopover {subreddit} />
	{/if}
	<div class="hidden gap-2 overflow-x-hidden lg:flex">
		•
		<span class="text-zinc-400">
			{author}
		</span>
	</div>
	•
	<div>
		<span class="hidden text-zinc-400 lg:block">
			{getTimeAgo(created_utc)}
		</span>
		<span class="text-zinc-400 lg:hidden">
			{getTimeAgo(created_utc, true)}
		</span>
	</div>
	{#if over_18}
		•
		<div class="flex h-5 items-center gap-1">
			<div class="mt-0.5 h-fit w-fit text-zinc-400">
				<ExclamationTriangle />
			</div>
			<span class="text-zinc-400"> 18+ </span>
		</div>
	{/if}

	{#each (flairs ?? []).filter((x) => x.e === 'text' && !!x.t) as flair}
		<div class="h-fit w-fit rounded-2xl bg-blue-400 px-2 text-sm">{cleanText(flair.t!)}</div>
	{/each}
</div>
