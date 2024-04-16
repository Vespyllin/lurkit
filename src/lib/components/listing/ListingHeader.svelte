<script lang="ts">
	import { getTimeAgo } from '$lib/client';

	const {
		subreddit_icon,
		subreddit_name,
		author,
		created_utc
	}: {
		subreddit_icon?: string;
		subreddit_name: string;
		author: string;
		created_utc: number;
	} = $props();
</script>

<div class="flex h-5 items-center gap-2">
	{#if subreddit_icon}
		<img src={subreddit_icon} class="my-auto h-5 rounded-full object-contain" />
	{/if}
	<span class="text-zinc-200">
		{subreddit_name}
	</span>
	•
	<span class="text-zinc-400">
		{author}
	</span>
	•
	<span class="text-zinc-400">
		{getTimeAgo(created_utc)}
	</span>
</div>
