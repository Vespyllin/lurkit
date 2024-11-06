<script lang="ts">
	import Markdown from '../ui/markdown/Markdown.svelte';
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
				class="h-40 w-full rounded-md object-cover"
				src={subredditData.banner_background_image}
			/>
		{:else}
			<div
				class="h-28 w-full rounded-md bg-secondary"
				style="background-color: {subredditData.primary_color};"
			></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="flex h-[5.5rem]">
		<img
			alt=""
			class="mr-4 aspect-square h-full rounded-full border-2"
			style="border-color: {subredditData.key_color};"
			src={icon_url}
		/>

		<div>
			<h1 class="text-3xl font-bold">r/{subredditData.display_name}</h1>
			<h2 class="text-xl text-zinc-200">
				Active since {new Date(subredditData.created_utc * 1000).getFullYear()}
			</h2>

			<div class="flex gap-3">
				<div>
					<span class="font-medium" style="color: {subredditData.key_color};">
						{subredditData.subscribers.toLocaleString()}
					</span>
					<span class="text-zinc-300">Subscribers</span>
				</div>

				<div class="flex">
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

	<!-- <Separator class="mb-2 mt-4 h-0.5" /> -->

	<Markdown class="mt-2 border-l-4 pl-2 text-zinc-300" text={subredditData.public_description} />
</div>

{#if subredditData.subreddit_type !== 'public'}
	<h1 class="text-4xl font-semibold">-- Private Subreddit --</h1>
{/if}

<Separator class="mb-2 mt-4 h-0.5" />
