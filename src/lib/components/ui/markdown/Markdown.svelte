<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import Markdown from 'svelte-markdown';
	import ImageRenderer from './ImageRenderer.svelte';

	let { text, class: className }: { text: string; class?: string } = $props();

	const REDDIT_IMAGE_PREVIEW_REGEX =
		/https:\/\/preview\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)\?width=\d+&format=\w+&auto=\w+&s=\w+/g;
	const REDDIT_IMAGE_REGEX = /https:\/\/i\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)/g;
	const REDDIT_SUBREDDIT_REGEX = /(?<!\S)r\/\w+/g;

	const embedRedditSubreddit = (text: string) => text.replace(REDDIT_SUBREDDIT_REGEX, '[$&](/$&)');
	const embedRedditPreview = (text: string) => text.replace(REDDIT_IMAGE_PREVIEW_REGEX, '![]($&)');
	const embedRedditImage = (text: string) => text.replace(REDDIT_IMAGE_REGEX, '![]($&)');
	const embedGiphy = (text: string) =>
		text.replace(
			/!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g,
			'![](https://media.giphy.com/media/$1/giphy.gif)'
		);

	const redirToLurkit = (text: string) => text.replace('www.reddit.com', 'lurkit-six.vercel.app');

	const embedMedia = (text: string) =>
		redirToLurkit(embedRedditSubreddit(embedRedditImage(embedRedditPreview(embedGiphy(text)))));

	const formatTable = (text: string) => {
		const lines = text.split('\n');

		const rowPattern = /^\|.*\|$/; // |{nothing or anything, also includes whitespace}|
		const separatorPattern = /\|\s*:?-{2,}:?\s*\|/; // | {:}(2+ '-'){:} |

		// inTable allows more than 1 table to be parsed as it will stop matching after a header
		// is found and start matching again once a row pattern is not detected in the line at hand
		let inTable = false;
		for (let i = 0; i < lines.length; i++) {
			const isRowMatch = rowPattern.test(lines[i]);

			if (!inTable && isRowMatch) {
				inTable = true;

				// If a separator already exists, skip this table
				if (i + 1 < lines.length && separatorPattern.test(lines[i + 1])) continue;

				const columnCount = lines[i].split('|').length - 1;
				const separator = new Array(columnCount - 1).fill('|------------').join('') + '|';
				lines.splice(i + 1, 0, separator);
			} else if (inTable && !isRowMatch) {
				inTable = false;
			}
		}

		return lines.join('\n');
	};

	const formattedText = embedMedia(cleanText(text));
</script>

<div
	class={cn(
		`	cursor-auto space-y-4
			[&_a]:inline-block [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800 
			[&_blockquote]:px-1 [&_blockquote]:text-zinc-400 
			[&_h1]:text-lg [&_h1]:font-semibold 
			[&_h2]:text-lg [&_h2]:font-medium 
			[&_h3]:font-medium 
			[&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-2 
			[&_td]:w-fit [&_th]:px-2 [&_thead]:border-b-2 
			[&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-2`,
		className
	)}
>
	<Markdown renderers={{ image: ImageRenderer }} source={formattedText} />
</div>
