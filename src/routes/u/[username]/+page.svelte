<script lang="ts">
	import { page } from '$app/stores';
	import { fetchUserAbout, fetchUserOverview } from '$lib/client';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import UserBanner from '$lib/components/users/UserBanner.svelte';
	import UserComment from '$lib/components/users/UserComment.svelte';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';

	const {
		params: { username }
	} = $page;

	const overviewQuery = useInfiniteQuery(
		[username, 'overview'],
		({ pageParam }: { pageParam?: string }) => fetchUserOverview(username, 50, pageParam),
		{ getNextPageParam: (lastGroup) => lastGroup?.data?.after }
	);

	const aboutQuery = useQuery([username, 'about'], () => fetchUserAbout(username));
</script>

<svelte:head>
	<title>
		{$aboutQuery.isFetching || $overviewQuery.isFetching
			? 'Loading...'
			: ($aboutQuery.error ?? `Lurkit - ${username}`)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		const { hasNextPage, isFetching, isError } = $overviewQuery;
		if (remainingPx < 1000 && hasNextPage && !isFetching && !isError) {
			$overviewQuery.fetchNextPage();
		}
	}}
/>

{#if $aboutQuery.isFetching}
	<FetchStatus fetching={$aboutQuery.isFetching} error={$aboutQuery.error as string | undefined} />
{:else if !$aboutQuery.data || 'error' in $aboutQuery.data}
	<div class="mx-auto py-24 text-center uppercase">
		<h1 class="text-7xl text-red-600">ERROR: Could not fetch user</h1>
	</div>
{:else}
	<div class="space-y-2">
		<UserBanner data={$aboutQuery.data.data} />

		<Separator class="h-0.5" />

		{#if !$overviewQuery.data && ($overviewQuery.isError || $overviewQuery.isFetching)}
			<FetchStatus
				fetching={$overviewQuery.isFetching}
				error={$overviewQuery.error as string | undefined}
			/>
		{:else}
			{#each $overviewQuery.data?.pages ?? [] as page}
				{#each page.data?.children ?? [] as child}
					<div>
						{#if child.kind == 't1'}
							<UserComment comment={child.data} />
						{:else if child.kind == 't3'}
							<ListingPortal listing={child.data} />
						{:else}
							<div class="rounded-md border border-red-500">
								Unhandled submission type: {(child as any).kind}
							</div>
						{/if}
					</div>

					<Separator />
				{/each}
			{/each}

			<FetchMoreStatus
				fetching={$overviewQuery.isFetching}
				error={$overviewQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
