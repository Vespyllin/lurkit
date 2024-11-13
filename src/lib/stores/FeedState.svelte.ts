import { fetchFeedData } from '$lib/client/subreddit';
import { titleFilter } from './titleFilter';

export function createFeedState() {
	let fetching = $state(true);
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();

	const uniqueIds: Set<string> = new Set<string>();
	let scrollTo: string | undefined = undefined;
	let lastPostId: string | undefined;

	const subFilter = [
		'r/murderedbywords',
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
		'r/genx',
		'r/politicalhumor',
		'r/goldenretrievers',
		'r/oneorangebraincell',
		'r/news',
		'r/blackcats',
		'r/hockey',
		'r/honkaistarrail',
		'r/aww',
		'r/awww',
		'r/pics',
		'r/genz',
		'r/chatgpt',
		'r/joerogan',
		'r/trans',
		'r/lgbt',
		'r/politics',
		'r/millenials',
		'r/conservative',
		'r/roastme',
		'r/kidsarefuckingstupid',
		'r/adviceanimals',
		'r/leopardsatemyface',
		'r/dnd',
		'r/dndmemes',
		'r/fauxmoi',
		'r/fundiesnarkuncensored',
		'r/witchesvspatriarchy',
		'r/egg_irl',
		'r/egg',
		'r/rupaulsdragrace',
		'r/ukraine',
		'r/memes',
		'r/selfawarewolves',
		'r/therewasanattempt',
		'r/peterexplainsthejoke',
		'r/unitedstatesofindia',
		'r/democrats',
		'r/mindblowingthings',
		'r/the_everything_bubble',
		'r/wallstreetbets',
		'r/lotrmemes',
		'r/facepalm',
		'r/indiasocial',
		'r/npr',
		'r/lotr',
		'r/anime',
		'r/dankmemes',
		'r/funnymemes',
		'r/publicfreakout',
		'r/genshin_impact_leaks',
		'r/houstonwade'
	].map((x) => x.toLowerCase());

	const fetchMore = async () => {
		fetching = true;

		const fetchRes = await fetchFeedData(undefined, 50, lastPostId, undefined, true);
		if (fetchRes.status === 'OK') {
			const newPosts = fetchRes.data
				.filter((listing) => !uniqueIds.has(listing.name))
				.filter((listing) => !subFilter.includes(listing.subreddit.display_name.toLowerCase()))
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
				`Failed to fetch next listings inside store.\nReason: ${error}\nLast post ID: ${lastPostId}`
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
