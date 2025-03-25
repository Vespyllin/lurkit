<script lang="ts">
	import { page } from '$app/stores';
	import { fetchSearchQuery } from '$lib/client';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { useInfiniteQuery } from '@sveltestack/svelte-query';

	const {
		url: { searchParams }
	} = $page;

	const queryParam = searchParams.get('q');
	const typeParam = searchParams.get('type');

	const searchQuery = useInfiniteQuery(
		[queryParam, typeParam],
		() => {
			if (!queryParam) return undefined;
			return fetchSearchQuery(queryParam, (typeParam as RedditSearchOptions | null) ?? undefined);
		},
		{ getNextPageParam: (lastGroup) => lastGroup?.data?.after }
	);
</script>

<!-- <p>Add category tabs</p>
<p>instead of listing portals use a reduced portal w/ a thumbnail</p>
<p>have a short community summary (click to go to community tab)</p> -->

<div class="space-y-2">
	{#each $searchQuery.data?.pages ?? [] as page}
		{#each page?.data?.children ?? [] as listing}
			<ListingPortal listing={listing.data} />
			<Separator />
		{/each}
	{/each}
</div>
