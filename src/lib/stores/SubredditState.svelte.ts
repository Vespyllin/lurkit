// import { fetchFeedData, fetchSubredditData } from '$lib/client/subreddit';

// export function createSubredditState() {
// 	let fetching = $state(true);
// 	let subredditData: any | undefined = $state();
// 	let feed: ListingData[] | undefined = $state();
// 	let error: string | undefined = $state();

// 	let uniqueIds: Set<string> = new Set<string>();

// 	let subreddit: string | undefined;
// 	let scrollTo: string | undefined;
// 	let lastPostId: string | undefined;

// 	const fetchSubreddit = async () => {
// 		if (!subreddit) return;
// 		const subredditRes = await fetchSubredditData(subreddit);
// 		if (subredditRes.status == 'OK') {
// 			subredditData = subredditRes.data;
// 		} else {
// 			error = subredditRes.reason;
// 		}
// 		fetching = false;
// 	};

// 	const refetch = async () => {
// 		const feedRes = await fetchFeedData(subreddit, 50, undefined, sort, true);
// 		if (feedRes.status == 'OK') {
// 			feed = feedRes.data;
// 			lastPostId = feedRes.data.at(-1)?.name;
// 			error = undefined;
// 		} else {
// 			listingError = feedRes.reason;
// 		}
// 		listingFetching = false;
// 	};

// 	return {
// 		get data() {
// 			return feed;
// 		},
// 		get fetching() {
// 			return fetching;
// 		},
// 		get error() {
// 			return error;
// 		},
// 		get scrollTo() {
// 			return scrollTo;
// 		},
// 		fetchMore: fetchMore,
// 		setScroll: (v: string) => (scrollTo = v),
// 		setSubreddit: (v: string) => (subreddit = v)
// 	};
// }
