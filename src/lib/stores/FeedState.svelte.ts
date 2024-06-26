import { fetchFeedData } from '$lib/client/subreddit';

export function createFeedState() {
	let fetching = $state(true);
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();

	let uniqueIds: Set<string> = new Set<string>();
	let scrollTo: string | undefined = undefined;
	let lastPostId: string | undefined;

	const subFilter = [
		'r/blackpeopletwitter',
		'r/ukrainewarvideoreport',
		'r/clevercomebacks',
		'r/worldnews',
		'r/prequelmemes',
		'r/india',
		'r/twoxchromosomes',
		'r/fluentinfinance',
		'r/nba',
		'r/superstonk',
		'r/whitepeopletwitter',
		'r/funny',
		'r/cats',
		'r/politicalhumor',
		'r/goldenretrievers',
		'r/oneorangebraincell',
		'r/news',
		'r/blackcats',
		'r/hockey',
		'r/pics',
		'r/politics'
	].map((x) => x.toLowerCase());

	const init = async () => {
		fetching = true;

		const fetchRes = await fetchFeedData(undefined, 50);
		if (fetchRes.status == 'OK') {
			const { data } = fetchRes;

			feed = data.filter((x) => !subFilter.includes(x.subreddit.display_name.toLowerCase()));
			data.forEach((x) => uniqueIds.add(x.name));

			lastPostId = data.at(-1)?.name;
		} else {
			error = fetchRes.reason;
		}

		fetching = false;
	};

	const fetchMore = async () => {
		if (!feed) return;
		fetching = true;

		const fetchRes = await fetchFeedData(undefined, 50, lastPostId);
		if (fetchRes.status === 'OK') {
			const newPosts = fetchRes.data
				.filter((listing) => !uniqueIds.has(listing.name))
				.filter((listing) => !subFilter.includes(listing.subreddit.display_name.toLowerCase()));

			newPosts.forEach((listing) => uniqueIds.add(listing.name));

			feed = feed.concat(newPosts);

			lastPostId = newPosts.at(-1)?.name;
		} else {
			error = fetchRes.reason;
			console.log(`Failed to fetch next listings.\nLast post ID: ${lastPostId}\nReason: ${error}`);
		}

		fetching = false;
	};

	return {
		get data() {
			if (!feed) init();
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
