<script lang="ts">
	import { cn } from '$lib/utils';
	import { ExclamationTriangle } from 'radix-icons-svelte';
	import Markdown from '../media/Markdown.svelte';

	const { data, class: classList }: { data: RedditT5Data; class?: string } = $props();

	const icon_url =
		(data.community_icon?.split('?')[0] ?? '').length > 0
			? data.community_icon?.split('?')[0]
			: (data.icon_img ?? '').length > 0
				? data.icon_img
				: '/favicon.png';
</script>

<div class={classList}>
	<div class="relative">
		{#if data.banner_background_image}
			<img
				alt=""
				class="h-40 w-full rounded-md object-cover"
				src={data.banner_background_image.split('?')[0]}
			/>
		{:else}
			<div
				class="h-20 w-full rounded-md bg-secondary"
				style="background-color: {data.primary_color};"
			></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="flex">
		<img
			alt=""
			class="mr-4 aspect-square h-16 rounded-full border-2"
			style="border-color: {data.key_color};"
			src={icon_url}
		/>

		<div class="flex w-full">
			<div>
				<h1 class="text-3xl font-bold">r/{data.display_name}</h1>

				<div class="flex items-center gap-2 text-lg">
					<span class="text-zinc-400">
						Active since {new Date(data.created_utc * 1000).getFullYear()}
					</span>

					{#if data.over18}
						•
						<div class="mt-0.5 flex items-center gap-1 text-zinc-400">
							<ExclamationTriangle />
							<span class="text-zinc-400 md:inline">18+</span>
						</div>
					{/if}
					{#if data.subreddit_type !== 'public'}
						<h1 class={cn('lowercase', data.subreddit_type !== 'private' && 'text-red-600')}>
							({data.subreddit_type ?? 'Untyped'})
						</h1>
					{/if}
				</div>
			</div>

			<div class="ml-auto flex h-fit flex-col">
				<span class="text-2xl text-zinc-300">Subscribers</span>
				<span class="ml-auto text-xl" style="color: {data.key_color};">
					{data.subscribers?.toLocaleString()}
				</span>
			</div>
		</div>
	</div>

	<div class="md mt-2 text-zinc-300">
		<Markdown text={data.public_description} />
	</div>
</div>
