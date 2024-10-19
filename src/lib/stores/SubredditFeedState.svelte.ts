export function createFeedState() {
	let fetching = $state(true);
	let subredditData: any | undefined = $state();
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();

	const uniqueIds: Set<string> = new Set<string>();

	let subreddit: string | undefined;
	let scrollTo: string | undefined = undefined;
	let lastPostId: string | undefined;

	const fetchSubreddit = async () => {};
	const fetchMore = async () => {
		fetching = true;

		// const fetchRes = await fetchFeedData(undefined, 50, lastPostId);
		// if (fetchRes.status === 'OK') {
		// 	const newPosts = fetchRes.data
		// 		.filter((listing) => !uniqueIds.has(listing.name))
		// 		.filter((listing) =>
		// 			titleFilter.every((title) => !listing.title.toLowerCase().includes(title))
		// 		);

		// 	newPosts.forEach((listing) => uniqueIds.add(listing.name));

		// 	if (!feed) feed = [];
		// 	feed.push(...newPosts);

		// 	lastPostId = newPosts.at(-1)?.name;
		// } else {
		// 	error = fetchRes.reason;
		// 	console.error(
		// 		`Failed to fetch next listings inside store.\nReason: ${error}\nLast post ID: ${lastPostId}`
		// 	);
		// }

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
		setScroll: (v: string) => (scrollTo = v),
		setSubreddit: (v: string) => (subreddit = v)
	};
}

export const FeedStore = createFeedState();
