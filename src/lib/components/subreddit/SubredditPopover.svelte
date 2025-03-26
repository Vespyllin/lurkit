<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Check, Trash } from 'radix-icons-svelte';
	import Spinner from '../layout/Spinner.svelte';
	import { cn } from '$lib/utils';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();
	let status: 'INIT' | 'LOADING' | 'DONE' = $state('INIT');

	const icon_url =
		(subreddit?.community_icon?.split('?')[0] ?? '').length > 0
			? subreddit?.community_icon?.split('?')[0]
			: (subreddit.icon_img ?? '').length > 0
				? subreddit.icon_img
				: '/favicon.png';
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger>
			<a
				class="flex items-center gap-2 hover:underline"
				href={`/${subreddit.display_name_prefixed}`}
			>
				<img alt="" src={icon_url} class="h-5 rounded-full object-contain" />
				<span class="text-zinc-200">
					{subreddit.display_name_prefixed}
				</span>
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<div class="flex gap-1">
				<img alt="" src={icon_url} class="mr-2 mt-1 h-[100px]" />

				<div>
					<a
						class="w-full text-xl font-semibold tracking-tighter hover:underline"
						href={`/${subreddit.display_name_prefixed}`}
					>
						{subreddit.display_name_prefixed}
					</a>

					<button
						onclick={async (e) => {
							e.preventDefault();
							status = 'LOADING';

							const res = await fetch('/api/filters/subreddit', {
								method: 'POST',
								body: JSON.stringify({ subreddit: subreddit.display_name_prefixed })
							});
							const resJson = await res.json();

							if (!!resJson.success) {
								status = 'DONE';
							} else {
								status = 'INIT';
							}
						}}
						class={cn(
							'hover ml-1 size-fit rounded-md p-1 transition-opacity hover:bg-zinc-700',
							status !== 'INIT' && 'pointer-events-none bg-none opacity-0 duration-1000'
						)}
					>
						{#if status == 'INIT'}
							<Trash size={20} />
						{:else if status == 'LOADING'}
							<Spinner class="size-5" />
						{:else}
							<Check size={20} />
						{/if}
					</button>

					{#if !subreddit.public_description}
						<div class="w-32 italic text-zinc-400">No description.</div>
					{:else}
						<div
							class="line-clamp-4 h-20 w-fit min-w-72 max-w-[500px] overflow-hidden text-ellipsis break-words text-zinc-400"
						>
							{subreddit.public_description}
						</div>
					{/if}
				</div>
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
