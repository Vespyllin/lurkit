<script lang="ts">
	import * as Tooltip from './ui/tooltip';

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
		<div class="flex items-center gap-2">
			<img src={icon_url} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name}
			</span>
		</div>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div class="flex max-h-28 max-w-2xl gap-3 px-1 py-2">
			<img src={icon_url} class="my-auto mr-1 h-24" />
			<div>
				<h2 class="text-xl font-semibold">{subreddit.display_name}</h2>
				<p class="line-clamp-3 break-words text-zinc-400">{subreddit.public_description}</p>
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
