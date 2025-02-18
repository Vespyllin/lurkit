<script lang="ts">
	import { Check, Trash } from 'radix-icons-svelte';
	import * as Tooltip from '../ui/tooltip';
	import Spinner from '../layout/Spinner.svelte';
	import { cn } from '$lib/utils';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();
	let status: 'neutral' | 'loading' | 'done' = $state('neutral');

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

			<button
				onclick={async () => {
					status = 'loading';

					const res = await fetch('/api/filters/subreddit', {
						method: 'POST',
						body: JSON.stringify({ subreddit: subreddit.display_name_prefixed })
					});
					const resJson = await res.json();

					if (!!resJson.success) {
						status = 'done';
					} else {
						status = 'neutral';
					}
				}}
				class={cn(
					'hover ml-1 size-fit rounded-md p-1 transition-all  hover:bg-zinc-700',
					status !== 'neutral' && 'pointer-events-none opacity-0 duration-1000'
				)}
			>
				{#if status == 'neutral'}
					<Trash size={20} />
				{:else if status == 'loading'}
					<Spinner class="size-5" />
				{:else}
					<Check size={20} />
				{/if}
			</button>

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
