<script lang="ts">
	import { cleanText } from '$lib';

	let { text }: { text: string } = $props();

	const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(png|jpg|jpeg|gif|bmp|svg|webp).*/g;
	const GIPHY_REGEX = /!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g;
	const REDDIT_SUBREDDIT_REGEX = /(?<!\S)r\/\w+/g;

	const wrapATagRegex = (regex: RegExp) => new RegExp(`<a href="(${regex.source})">\\1<\\/a>`, 'g');

	const formattedText = cleanText(text)
		.replaceAll(wrapATagRegex(IMAGE_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(wrapATagRegex(GIPHY_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(REDDIT_SUBREDDIT_REGEX, '[$&](/$&)')
		.replaceAll(/(www|new).reddit.com/g, 'lurkit-six.vercel.app');
</script>

{@html formattedText}
