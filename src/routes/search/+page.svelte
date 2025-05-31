<script lang="ts">
	import { page } from '$app/state';

	import { fetchSearchQuery } from '$lib/client';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { useInfiniteQuery } from '@sveltestack/svelte-query';
	import ThumbnailPortal from '$lib/components/listing/ThumbnailPortal.svelte';
	import { afterNavigate } from '$app/navigation';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import ImageListingSkeleton from '$lib/components/layout/ImageListingSkeleton.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LightningBolt } from 'radix-icons-svelte';

	const {
		url: { searchParams }
	} = page;

	const queryParam = searchParams.get('q');
	const typeParam = searchParams.get('type') as RedditSearchCategories | null;

	const searchQuery = useInfiniteQuery(
		[queryParam, typeParam],
		({ pageParam }: { pageParam?: string }) => {
			if (!queryParam) return undefined;
			return fetchSearchQuery(queryParam, typeParam ?? undefined, 50, pageParam);
		},
		{ getNextPageParam: (lastGroup) => lastGroup?.data?.after }
	);

	afterNavigate((e) => {
		if (!e.from || !e.from.url) return;

		const newQ = page.url.searchParams.get('q');
		const newType = page.url.searchParams.get('type') as RedditSearchCategories | null;

		searchQuery.setOptions({
			queryKey: [newQ, newType],
			queryFn: ({ pageParam }: { pageParam?: string }) => {
				if (!newQ) return undefined;
				return fetchSearchQuery(newQ, newType ?? undefined, 50, pageParam);
			},
			getNextPageParam: (lastGroup) => lastGroup?.data?.after
		});
	});
</script>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		const { hasNextPage, isFetching, isError } = $searchQuery;

		if (remainingPx < 1000 && hasNextPage && !isFetching && !isError) {
			$searchQuery.fetchNextPage();
		}
	}}
/>

<!-- <p>have a short community summary (click to go to community tab)</p> -->
{#if !$searchQuery.data}
	{#if $searchQuery.isFetching}
		<ImageListingSkeleton />
	{:else}
		<FetchStatus fetching={false} error={$searchQuery.error as string | undefined} />
	{/if}
{:else}
	<div class="space-y-2">
		{#each $searchQuery.data?.pages ?? [] as page}
			{#each page?.data?.children ?? [] as listing}
				<ThumbnailPortal listing={listing.data} />

				<Separator />
			{/each}
		{/each}

		{#if $searchQuery.isFetching || !!$searchQuery.error}
			<FetchMoreStatus
				fetching={$searchQuery.isFetching}
				error={$searchQuery.error as string | undefined}
				retryFn={$searchQuery.fetchNextPage}
			/>
		{:else if !$searchQuery.hasNextPage && !$searchQuery.isFetching && !$searchQuery.isError}
			<div class="mx-auto h-20 justify-center py-2 text-center">
				<Button
					class="h-12 rounded-full bg-primary text-lg hover:bg-primary/90"
					onclick={() => $searchQuery.refetch()}
				>
					<LightningBolt size={25} /> Load more
				</Button>
			</div>
		{/if}
	</div>
{/if}
