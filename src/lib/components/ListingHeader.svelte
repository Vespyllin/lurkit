<script lang="ts">
	import { ExclamationTriangle } from 'radix-icons-svelte';
	import SubredditPopover from './SubredditPopover.svelte';
	import { getTimeAgo } from '$lib';

	let {
		subreddit,
		author,
		created_utc,
		over_18
	}: {
		subreddit: SubredditDetails;
		author: string;
		created_utc: number;
		over_18: boolean;
	} = $props();
</script>

<div class="flex h-5 items-center gap-2">
	<SubredditPopover {subreddit} />
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
			<div class="h-fit w-fit text-zinc-400">
				<ExclamationTriangle />
			</div>
			<span class="text-zinc-400"> 18+ </span>
		</div>
	{/if}
</div>
