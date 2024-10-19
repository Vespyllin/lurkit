<script lang="ts">
	import { ExclamationTriangle, LockClosed, Reload } from 'radix-icons-svelte';
	import { cleanText, getTimeAgo } from '$lib';
	import SubredditPopover from '../subreddit/SubredditPopover.svelte';

	let {
		subreddit,
		edited,
		author,
		created_utc,
		crossposted_from,
		over_18,
		locked,
		flairs
	}: {
		subreddit?: SubredditDetails;
		edited?: boolean | number;
		author: string;
		created_utc: number;
		over_18: boolean;
		crossposted_from: string | undefined;
		locked: boolean;
		flairs?: RedditLinkFlairRichText[];
	} = $props();
</script>

<div class="flex h-5 items-center gap-2">
	{#if subreddit}
		<SubredditPopover {subreddit} />
	{/if}

	<div class="hidden gap-2 lg:flex">
		•
		<span class="text-zinc-400">
			{author}
		</span>
	</div>

	•
	<span class="hidden text-zinc-400 lg:inline">
		{getTimeAgo(created_utc)}{#if edited}
			*
		{/if}
	</span>
	<span class="text-zinc-400 lg:hidden">
		{getTimeAgo(created_utc, true)}{#if edited}
			*
		{/if}
	</span>

	{#if over_18}
		•
		<div class="flex items-center gap-1">
			<div class="mt-0.5 h-fit w-fit text-zinc-400">
				<ExclamationTriangle />
			</div>
			<span class="text-zinc-400"> 18+ </span>
		</div>
	{/if}

	{#if crossposted_from}
		•
		<div class="flex items-center gap-1">
			<div class="h-fit w-fit text-zinc-400">
				<Reload />
			</div>
			<span class="text-zinc-400"> {crossposted_from} </span>
		</div>
	{/if}

	{#if locked}
		•
		<div class="flex items-center gap-1">
			<div class="h-fit w-fit text-zinc-400">
				<LockClosed />
			</div>

			<span class="hidden text-zinc-400 lg:inline"> locked </span>
		</div>
	{/if}

	<div class="flex h-fit w-fit items-center gap-1 rounded-2xl bg-secondary px-2 text-sm">
		{#each flairs ?? [] as flair}
			{#if flair.e == 'text'}
				{cleanText(flair.t!)}
			{:else if flair.e == 'emoji'}
				<img alt="" src={flair.u} class="h-4 px-0.5" />
			{/if}
		{/each}
	</div>
</div>
