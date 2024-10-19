<script lang="ts">
	import { cleanText } from '$lib';
	import Separator from '../ui/separator/separator.svelte';

	const { subredditData }: { subredditData: SubredditData } = $props();

	const icon_url =
		(subredditData.community_icon?.split('?')[0] ?? '').length > 0
			? subredditData.community_icon?.split('?')[0]
			: (subredditData.icon_img ?? '').length > 0
				? subredditData.icon_img
				: '/favicon.png';
</script>

<div>
	<div class="relative">
		{#if subredditData.banner_background_image}
			<img
				alt=""
				class="h-24 w-full rounded-md object-cover"
				src={subredditData.banner_background_image}
			/>
		{:else}
			<div
				class="h-24 w-full rounded-md bg-secondary"
				style="background-color: {subredditData.primary_color};"
			></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="mt-2 px-1">
		<img
			alt=""
			class="from-2% float-left mr-4 h-20 w-20 rounded-full border-2"
			style="border-color: {subredditData.key_color};"
			src={icon_url}
		/>

		<div class="grid grid-cols-2">
			<div>
				<h1 class="text-3xl font-bold">r/{subredditData.display_name}</h1>
				<div class="text-zinc-300">{cleanText(subredditData.public_description)}</div>
			</div>

			<div>
				<h2 class="ml-auto mt-auto text-right align-baseline text-xl">
					Active since {new Date(subredditData.created_utc * 1000).getFullYear()}
				</h2>

				<div class="ml-auto text-right">
					<div>
						<span class="font-medium">{subredditData.subscribers.toLocaleString()}</span>
						<span class="text-zinc-300">Subscribers</span>
					</div>
					<div class="ml-auto flex w-fit">
						<span class="font-medium" style="color: {subredditData.primary_color};">
							{subredditData.active_user_count.toLocaleString()}
						</span>
						<div class="flex items-center">
							<div class="ml-1.5 mr-0.5 h-2 w-2 rounded-full bg-green-600"></div>
							<span class="text-zinc-300"> Online </span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if subredditData.subreddit_type !== 'public'}
		<h1 class="text-4xl font-semibold">-- Private Subreddit --</h1>
	{/if}

	<Separator class="mb-2 mt-4 h-0.5" />
</div>
