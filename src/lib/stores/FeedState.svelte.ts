import { fetchFeedData } from '$lib/client/subreddit';
import { titleFilter, subredditFilter } from './filters';

export function createFeedState() {
	let fetching = $state(true);
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();

	const uniqueIds: Set<string> = new Set<string>();
	let scrollTo: string | undefined = undefined;
	let lastPostId: string | undefined;

	const fetchMore = async () => {
		fetching = true;

		const fetchRes = await fetchFeedData(undefined, 50, lastPostId, undefined, true);
		if (fetchRes.status === 'OK') {
			const newPosts = fetchRes.data
				.filter((listing) => !uniqueIds.has(listing.name))
				.filter(
					(listing) => !subredditFilter.includes(listing.subreddit.display_name.toLowerCase())
				)
				.filter((listing) =>
					titleFilter.every((title) => !listing.title.toLowerCase().includes(title))
				);

			newPosts.forEach((listing) => uniqueIds.add(listing.name));

			if (!feed) feed = [];
			feed.push(...newPosts);

			lastPostId = newPosts.at(-1)?.name;
		} else {
			error = fetchRes.reason;
			console.error(
				`Failed to fetch next listings inside store.\nReason: \"${error}\"\nLast post ID: ${lastPostId}`
			);
		}

		fetching = false;
	};

	return {
		get data() {
			return feed;
		},
		get fetching() {
			return fetching;
		},
		get error() {
			return error;
		},
		get scrollTo() {
			return scrollTo;
		},
		fetchMore: fetchMore,
		setScroll: (v: string) => (scrollTo = v)
	};
}

export const FeedStore = createFeedState();
