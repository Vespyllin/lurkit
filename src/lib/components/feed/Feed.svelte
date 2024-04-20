<script lang="ts">
	import Listing from '../listing/Listing.svelte';
	import { Separator } from '../ui/separator';

	let { feed }: { feed: FeedData } = $props();
</script>

<div class="flex flex-col gap-4">
	{#each feed.posts ?? [] as post}
		<div class="flex w-full flex-col rounded-2xl">
			<div>
				<Listing {post} />
			</div>
		</div>
		<Separator />
	{/each}
</div>
