import { fetchFeedData } from '$lib/client/subreddit';

export function createFeedState() {
	let fetching = $state(true);
	let feed: FeedData | undefined = $state();
	let error: string | undefined = $state();
	let uniqueIds: Set<string> = new Set<string>();

	let scrollTo: string | undefined = undefined;

	let lastPostId: string | undefined;

	const init = async () => {
		fetching = true;

		const data = await fetchFeedData(undefined, 50);
		if (data.status == 'OK') {
			feed = data.data;
			lastPostId = data.data.posts.at(-1)?.name;
			data.data.posts.forEach((x) => uniqueIds.add(x.name));
		} else {
			error = data.reason;
		}

		fetching = false;
	};

	const fetchMore = async () => {
		if (!feed) return;

		console.log('Fetching more data');

		fetching = true;

		const fetchedFeed = await fetchFeedData(undefined, 50, lastPostId);
		if (fetchedFeed.status === 'OK') {
			const newPosts = fetchedFeed.data.posts.filter((x) => {
				if (!uniqueIds.has(x.name)) {
					return true;
				}
				console.log('FILTERING', x.title);
				return false;
			});
			feed.after = fetchedFeed.data.after;
			feed.dist += newPosts.length;
			feed.posts = feed.posts.concat(newPosts);
			lastPostId = fetchedFeed.data.posts.at(-1)?.name;
		} else {
			error = fetchedFeed.reason;
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
