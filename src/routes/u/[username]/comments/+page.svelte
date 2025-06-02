<script lang="ts">
	import { page } from '$app/state';
	import {
		fetchUserAbout,
		fetchUserCommented,
		fetchUserOverview,
		fetchUserSubmitted
	} from '$lib/client';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import UserBanner from '$lib/components/users/UserBanner.svelte';
	import UserComment from '$lib/components/users/UserComment.svelte';
	import UserNavigation from '$lib/components/users/UserNavigation.svelte';
	import { cn } from '$lib/utils';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';

	const {
		params: { username }
	} = page;

	let category = $state<'overview' | 'submitted' | 'comments'>('overview');

	const commentedQuery = useInfiniteQuery(
		[username, 'commented'],
		({ pageParam }: { pageParam?: string }) => fetchUserCommented(username, 50, pageParam),
		{
			getNextPageParam: (lastGroup) =>
				lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	const aboutQuery = useQuery([username, 'about'], () => fetchUserAbout(username));
</script>

<svelte:head>
	<title>
		{$commentedQuery.isFetching
			? 'Loading...'
			: ($aboutQuery.error ?? $commentedQuery.error ?? `Lurkit - ${username}`)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		if (remainingPx < 1000) {
			if ($commentedQuery.hasNextPage && !$commentedQuery.isFetching && !$commentedQuery.isError) {
				$commentedQuery.fetchNextPage();
			}
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

		<UserNavigation category="comments" {username} />

		{#if !$commentedQuery.data && ($commentedQuery.isError || $commentedQuery.isFetching)}
			<FetchStatus
				fetching={$commentedQuery.isFetching}
				error={$commentedQuery.error as string | undefined}
			/>
		{:else}
			{#each $commentedQuery.data?.pages ?? [] as page}
				{#each page.data?.children ?? [] as child}
					<UserComment comment={child.data} />

					<Separator />
				{/each}
			{/each}

			<FetchMoreStatus
				fetching={$commentedQuery.isFetching}
				error={$commentedQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
