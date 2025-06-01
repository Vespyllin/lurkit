<script lang="ts">
	import { page } from '$app/state';

	import { fetchListings, fetchSubreddit } from '$lib/client';

	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import SubredditBanner from '$lib/components/subreddit/SubredditBanner.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { CaretDown, Star, Rocket, LightningBolt, DoubleArrowUp, Gear } from 'radix-icons-svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { type ComponentType } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';

	const {
		params: { subreddit },
		url: { searchParams }
	} = page;

	const initSortParam = searchParams.get('sort') ?? undefined;
	const initTimescaleParam =
		initSortParam == 'top' ? (searchParams.get('timescale') ?? undefined) : undefined;

	let sortParam: string | undefined = $state(initSortParam);
	let timescaleParam: string | undefined = $state(initTimescaleParam);

	const subredditQuery = useQuery([subreddit], () => fetchSubreddit(subreddit));

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) =>
		fetchListings(
			subreddit,
			25,
			pageParam,
			sortParam as RedditSubredditSortOptions,
			true,
			timescaleParam
		);

	const listingsQuery = useInfiniteQuery(
		[subreddit, initSortParam, initTimescaleParam],
		fetchNextListings,
		{
			getNextPageParam: (lastGroup) => undefined
			// lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	afterNavigate((e) => {
		if (!e.from || !e.from.url) return;

		const newSort = page.url.searchParams.get('sort') ?? undefined;
		const newTimescale =
			newSort == 'top' ? (page.url.searchParams.get('timescale') ?? undefined) : undefined;

		sortParam = newSort;
		timescaleParam = newTimescale;

		listingsQuery.setOptions({
			queryKey: [subreddit, newSort, newTimescale],
			queryFn: fetchNextListings
		});
	});

	const sortOptions: {
		option: RedditSubredditSortOptions | 'default';
		icon: ComponentType | undefined;
	}[] = [
		{ option: 'default', icon: Gear },
		{ option: 'top', icon: Star },
		{ option: 'rising', icon: DoubleArrowUp },
		{ option: 'new', icon: LightningBolt },
		{ option: 'hot', icon: Rocket }
	];

	const timescales: string[] = ['today', 'week', 'month', 'year', 'all'];
</script>

<svelte:head>
	<title>
		{$listingsQuery.isFetching || $subredditQuery.isFetching
			? 'Loading...'
			: ($subredditQuery.error ??
				$listingsQuery.error ??
				('error' in $subredditQuery?.data!
					? $subredditQuery?.data?.message
					: $subredditQuery?.data?.data.display_name_prefixed))}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		const { hasNextPage, isFetching, isError } = $listingsQuery;

		if (remainingPx < 1000 && !isFetching && hasNextPage && !isError) {
			$listingsQuery.fetchNextPage();
		}
	}}
/>

{#if $subredditQuery.isFetching}
	<FetchStatus
		fetching={$subredditQuery.isFetching}
		error={$subredditQuery.error as string | undefined}
	/>
{:else if !$subredditQuery.data || 'error' in $subredditQuery.data}
	<div class="mx-auto py-24 text-center uppercase">
		<h1 class="text-7xl text-red-600">
			{$subredditQuery.data?.reason ?? 'ERROR: Could not fetch subreddit info'}
		</h1>
		<span class={cn(!$subredditQuery.data?.reason && 'text-5xl')}>
			ERROR: {$subredditQuery.data?.error}: {$subredditQuery.data?.message}
		</span>
	</div>
{:else}
	<div class="space-y-2">
		<SubredditBanner data={$subredditQuery.data.data} />

		<div class="flex gap-2">
			<DropdownMenu.Root>
				<div class="flex leading-8">
					<span class="mr-2 text-lg">Sort by:</span>
					<DropdownMenu.Trigger>
						<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
							<span class="ml-2 text-lg">{sortParam ?? 'default'}</span>
							<CaretDown size={18} />
						</div>
					</DropdownMenu.Trigger>
				</div>
				<DropdownMenu.Content
					preventScroll={false}
					class="space-y-0.5 bg-background font-['Montserrat']"
				>
					{#each sortOptions as sortOption}
						{@const route = `/r/${subreddit}${sortOption.option !== 'default' ? `?sort=${sortOption.option}` : ''}`}
						{#if (sortParam == undefined ? 'default' : sortParam) !== sortOption.option}
							<a href={route}>
								<DropdownMenu.Item
									class="cursor-pointer rounded-sm font-normal hover:bg-accent"
									onclick={() => {
										goto(route);
									}}
								>
									<sortOption.icon class="mr-1" />
									<span>{sortOption.option}</span>
								</DropdownMenu.Item>
							</a>
						{/if}
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#if sortParam == 'top'}
				<DropdownMenu.Root>
					<div class="flex leading-8">
						<span class="mr-2 text-lg">Time:</span>
						<DropdownMenu.Trigger>
							<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
								<span class="ml-2 text-lg">{timescaleParam ?? 'today'}</span>
								<CaretDown size={18} />
							</div>
						</DropdownMenu.Trigger>
					</div>
					<DropdownMenu.Content
						preventScroll={false}
						class="space-y-0.5 bg-background font-['Montserrat']"
					>
						{#each timescales as timescaleOption}
							{@const route =
								`/r/${subreddit}?sort=top` +
								(timescaleOption == 'today' ? '' : `&timescale=${timescaleOption}`)}

							{#if (timescaleParam == undefined ? 'today' : timescaleParam) !== timescaleOption}
								<DropdownMenu.Item
									class="cursor-pointer rounded-sm font-normal hover:bg-accent"
									onclick={() => {
										goto(route);
									}}
								>
									<span>{timescaleOption}</span>
								</DropdownMenu.Item>
							{/if}
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>

		<Separator class="h-0.5" />

		{#if !$listingsQuery.data && ($listingsQuery.isError || $listingsQuery.isFetching)}
			<FetchStatus
				fetching={$listingsQuery.isFetching}
				error={$listingsQuery.error as string | undefined}
			/>
		{:else}
			{@const pages = $listingsQuery.data?.pages ?? []}

			{#each pages as page, pIdx}
				{@const listings = page?.data?.children ?? []}

				{#each listings as listing, lIdx}
					<ListingPortal inSubreddit listing={listing.data} />

					<Separator class={pIdx + 1 == pages.length && lIdx + 1 == listings.length && 'hidden'} />
				{/each}
			{/each}

			{#if $listingsQuery.isFetching || !!$listingsQuery.error}
				<FetchMoreStatus
					fetching={$listingsQuery.isFetching}
					error={$listingsQuery.error as string | undefined}
				/>
			{:else if !$listingsQuery.hasNextPage && !$listingsQuery.isFetching && !$listingsQuery.isError}
				<div class="mx-auto h-20 justify-center py-2 text-center">
					<Button
						class="h-12 rounded-full bg-primary text-lg hover:bg-primary/90"
						onclick={() => $listingsQuery.refetch()}
					>
						<LightningBolt size={25} /> Load more
					</Button>
				</div>
			{/if}
		{/if}
	</div>
{/if}
