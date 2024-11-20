<script lang="ts">
	import { cn } from '$lib/utils';
	import { Markdown } from '../media';
	import * as Tooltip from '../ui/tooltip';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();

	const icon_url =
		(subreddit?.community_icon?.split('?')[0] ?? '').length > 0
			? subreddit?.community_icon?.split('?')[0]
			: (subreddit.icon_img ?? '').length > 0
				? subreddit.icon_img
				: '/favicon.png';
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<a class="flex items-center gap-2 hover:underline" href={`/${subreddit.display_name_prefixed}`}>
			<img alt="" src={icon_url} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name_prefixed}
			</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content class={cn('pt-1', !subreddit.public_description && 'hidden')}>
		<div class="w-96">
			<div class="float-left mr-2 mt-[5px] flex h-[6.25rem] max-w-32">
				<img alt="" src={icon_url} class="my-auto h-full" />
			</div>

			<div>
				<h2 class="text-xl font-semibold tracking-tighter">{subreddit.display_name}</h2>
				<div class="text-zinc-400">
					{#if !subreddit.public_description}
						none
					{:else}
						<Markdown text={subreddit.public_description} />
					{/if}
				</div>
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
