<script lang="ts">
	import { cleanText } from '$lib';
	import { User } from 'lucide-svelte';

	let { data }: { data: RedditT2Data } = $props();

	const icon_img = data.icon_img?.split('?')[0];
</script>

{#if data.subreddit.banner_img}
	<img
		alt=""
		class="h-40 w-full rounded-md object-cover"
		src={data.subreddit.banner_img.split('?')[0]}
	/>
{/if}

<div
	class="relative overflow-hidden rounded-lg border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm"
>
	<div class="absolute inset-0 -z-50 bg-gradient-to-br from-accent/15 to-zinc-800/5"></div>

	<div class="flex items-start gap-4 p-2">
		<div class="relative">
			<img
				src={icon_img}
				alt={data.subreddit.title}
				class="h-20 w-20 rounded-full border-2 border-border/50 bg-muted object-cover"
			/>

			<div
				class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent"
			>
				<User class="h-3 w-3 text-white" />
			</div>
		</div>

		<div class="flex-1 space-y-1">
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold text-foreground">
					{!data.subreddit?.title.length ? data.name : data.subreddit?.title}
				</h1>

				{#if data.verified}
					<div class="rounded-full bg-zinc-500 p-0.5 px-1.5 text-xs font-medium">Verified</div>
				{/if}

				<div class="ml-auto">
					<span class="text-muted-foreground">Created: </span>
					<span>
						{new Date(data.created_utc * 1000).toDateString().split(' ').slice(1).join(' ')}
					</span>
				</div>
			</div>

			<p class={!!data.subreddit.public_description ? 'text-zinc-100' : 'text-muted-foreground'}>
				{!!data.subreddit.public_description
					? cleanText(data.subreddit.public_description)
					: 'No description.'}
			</p>

			<div class="flex items-center gap-4 text-sm text-muted-foreground">
				<div class="flex items-center gap-1">
					<span class="font-medium text-foreground"
						>{(data.awarder_karma + data.link_karma).toLocaleString()}</span
					>
					<span>post karma</span>
				</div>

				<div class="flex items-center gap-1">
					<span class="font-medium text-foreground">{data.comment_karma.toLocaleString()}</span>
					<span>comment karma</span>
				</div>
			</div>
		</div>
	</div>
</div>
