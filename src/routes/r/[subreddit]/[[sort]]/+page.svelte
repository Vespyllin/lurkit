<script lang="ts">
	import { page } from '$app/stores';

	import { fetchListings, fetchSubreddit } from '$lib/client';
	import { subredditFilter, titleFilter } from '$lib/filters';

	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import SubredditBanner from '$lib/components/subreddit/SubredditBanner.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { CaretDown, Star, Rocket, LightningBolt, DoubleArrowUp, Gear } from 'radix-icons-svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ComponentType } from 'svelte';

	const {
		params: { subreddit, sort }
	} = $page;

	const subredditQuery = useQuery(`r/${subreddit}`, () => fetchSubreddit(subreddit));

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(
			subreddit,
			50,
			pageParam,
			sort as RedditSubredditSortOptions,
			true
		);

		if (!data || !data.data) return undefined;

		const filteredChildren = data.data.children
			?.filter((listing) => {
				const subredditDisplayName = listing.data.sr_detail?.display_name?.toLowerCase();
				return subredditDisplayName ? !subredditFilter.includes(subredditDisplayName) : true;
			})
			.filter((listing) => {
				return titleFilter.every((title) => !listing.data.title.toLowerCase().includes(title));
			});

		const filteredData: RedditListing<RedditT3DataWrapper> = {
			kind: data.kind,
			data: {
				...data.data,
				children: filteredChildren
			}
		};

		return filteredData;
	};

	const listingsQuery = useInfiniteQuery(`r/${subreddit}/listings`, fetchNextListings, {
		getNextPageParam: (lastGroup) => lastGroup?.data?.children?.at(-1)?.data.name
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
</script>

<svelte:head>
	<title>
		{$listingsQuery.isFetching || $subredditQuery.isFetching
			? 'Loading...'
			: ($subredditQuery.error ??
				$listingsQuery.error ??
				'r/' + $subredditQuery?.data?.data.display_name_prefixed)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		const { hasNextPage, isFetching, isError } = $listingsQuery;
		if (remainingPx < 1000 && hasNextPage && !isFetching && !isError) {
			$listingsQuery.fetchNextPage();
		}
	}}
/>

{#if !$subredditQuery.data || !$listingsQuery.data}
	<FetchStatus
		fetching={$listingsQuery.isFetching || $subredditQuery.isFetching}
		error={($subredditQuery.error ?? $listingsQuery.error) as string | undefined}
	/>
{:else}
	<div class="space-y-2">
		<SubredditBanner data={$subredditQuery.data.data} />

		<DropdownMenu.Root preventScroll={false}>
			<div class="flex leading-8">
				<span class="mr-2 text-lg">Sort by:</span>
				<DropdownMenu.Trigger>
					<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
						<span class="ml-2 text-lg">{sort ?? 'default'}</span>
						<CaretDown size={18} />
					</div>
				</DropdownMenu.Trigger>
			</div>
			<DropdownMenu.Content class="space-y-0.5 bg-background font-['Ubuntu']">
				{#each sortOptions as sortOption}
					{@const route = `/r/${subreddit}/${sortOption.option !== 'default' ? sortOption.option : ''}`}
					<a data-sveltekit-reload href={route}>
						<DropdownMenu.Item class="cursor-pointer rounded-sm font-normal hover:bg-accent">
							<sortOption.icon class="mr-1" />
							<span>{sortOption.option}</span>
						</DropdownMenu.Item>
					</a>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Separator class="h-0.5" />

		{#each $listingsQuery.data?.pages ?? [] as page}
			{#each page?.data?.children ?? [] as listing}
				<ListingPortal listing={listing.data} />
				<Separator />
			{/each}
		{/each}
		{#if $listingsQuery.isError || $listingsQuery.isFetching}
			<FetchMoreStatus
				fetching={$listingsQuery.isFetching}
				error={$listingsQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
