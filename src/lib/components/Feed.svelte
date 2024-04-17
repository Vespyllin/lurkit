<script lang="ts">
	import Listing from './listing/Listing.svelte';

	let { feed }: { feed: FeedData } = $props();
</script>

<div class="mx-auto w-full space-y-2 lg:max-w-5xl">
	{#each feed.posts ?? [] as post}
		<div class="flex w-full flex-col gap-2 rounded-2xl bg-zinc-900 p-4 px-6">
			<Listing {post} />
		</div>
	{/each}
</div>
