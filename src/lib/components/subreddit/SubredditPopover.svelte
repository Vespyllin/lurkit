<script lang="ts">
	import { cleanText } from '$lib';
	import * as Tooltip from '../ui/tooltip';

	let { subreddit }: { subreddit: SubredditDetails } = $props();

	const icon_url =
		(subreddit?.community_icon?.split('?')[0] ?? '').length > 0
			? subreddit?.community_icon?.split('?')[0]
			: (subreddit.icon_img ?? '').length > 0
				? subreddit.icon_img
				: '/favicon.png';
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<a class="flex items-center gap-2 hover:underline" href={`/${subreddit.display_name}`}>
			<img src={icon_url} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name}
			</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div class="flex h-28 gap-3 py-1.5">
			<img src={icon_url} class="my-auto mr-1 h-full" />
			<div class="-mt-1 w-fit max-w-64">
				<h2 class="text-xl font-semibold">{subreddit.display_name}</h2>
				<div class="line-clamp-4 text-zinc-400">
					{cleanText(subreddit.public_description)}
				</div>
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
