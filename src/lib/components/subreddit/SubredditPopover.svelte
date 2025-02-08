<script lang="ts">
	import { cn } from '$lib/utils';
	import Markdown from '../media/Markdown.svelte';
	import * as Tooltip from '../ui/tooltip';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();

	const icon_url =
		(subreddit?.community_icon?.split('?')[0] ?? '').length > 0
			? subreddit?.community_icon?.split('?')[0]
			: (subreddit.icon_img ?? '').length > 0
				? subreddit.icon_img
				: '/favicon.png';
</script>

<Tooltip.Root openDelay={50}>
	<Tooltip.Trigger>
		<a class="flex items-center gap-2 hover:underline" href={`/${subreddit.display_name_prefixed}`}>
			<img alt="" src={icon_url} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name_prefixed}
			</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content class="p-2 pt-1">
		<div class="h-fit min-w-72 max-w-[500px]">
			<img alt="" src={icon_url} class="float-left mr-2 mt-1 h-[100px]" />

			<a
				class="w-full text-xl font-semibold tracking-tighter hover:underline"
				href={`/${subreddit.display_name_prefixed}`}
			>
				{subreddit.display_name_prefixed}
			</a>

			<div class="text-zinc-400">
				{#if !subreddit.public_description}
					<span class="italic"> No description. </span>
				{:else}
					<span>
						{subreddit.public_description}
					</span>
				{/if}
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
