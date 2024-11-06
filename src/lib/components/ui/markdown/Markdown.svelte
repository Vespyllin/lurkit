<script lang="ts">
	import { cleanText } from '$lib';

	let { text }: { text: string } = $props();

	const REDDIT_IMAGE_PREVIEW_REGEX =
		/https:\/\/preview\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)\?width=\d+&format=\w+&auto=\w+&s=\w+/g;
	const REDDIT_IMAGE_REGEX = /https:\/\/i\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)/g;
	const REDDIT_SUBREDDIT_REGEX = /(?<!\S)r\/\w+/g;
	const GIPHY_REGEX = /!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g;

	const wrapATagRegex = (regex: RegExp) => new RegExp(`<a href="(${regex.source})">\\1<\\/a>`, 'g');

	const embedRedditSubreddit = (text: string) =>
		text.replaceAll(REDDIT_SUBREDDIT_REGEX, '[$&](/$&)');

	const embedRedditPreview = (text: string) =>
		text.replaceAll(wrapATagRegex(REDDIT_IMAGE_PREVIEW_REGEX), '<a href="$1"><img src="$1"/></a>');

	const embedRedditImage = (text: string) =>
		text.replaceAll(wrapATagRegex(REDDIT_IMAGE_REGEX), '<a href="$1"><img src="$1"/></a>');

	const embedGiphy = (text: string) =>
		text.replaceAll(wrapATagRegex(GIPHY_REGEX), '<img src="$1"/>');

	const redirToLurkit = (text: string) =>
		text.replaceAll(/(www|new).reddit.com/g, 'lurkit-six.vercel.app');

	const formattedText = embedGiphy(
		redirToLurkit(embedRedditImage(embedRedditSubreddit(embedRedditPreview(cleanText(text)))))
	);
</script>

{@html formattedText}
