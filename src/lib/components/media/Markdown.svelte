<script lang="ts">
	import { cleanText } from '$lib';
	import { onMount } from 'svelte';

	let { text, crop }: { text: string; crop?: boolean } = $props();

	const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(png|jpg|jpeg|gif|bmp|svg|webp).*/g;
	const GIPHY_REGEX = /!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g;
	const REDDIT_SUBREDDIT_REGEX = /(?<!\S)r\/\w+/g;

	const wrapATagRegex = (regex: RegExp) => new RegExp(`<a href="(${regex.source})">\\1<\\/a>`, 'g');

	const formattedText = cleanText(text)
		.replaceAll(wrapATagRegex(IMAGE_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(wrapATagRegex(GIPHY_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(REDDIT_SUBREDDIT_REGEX, '[$&](/$&)')
		.replaceAll(/(www|new).reddit.com/g, 'lurkit-six.vercel.app');

	let container: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!crop) return;

		const children = container?.childNodes[1].childNodes;
		if (!container || !children) return;

		const boundingContainer = container?.parentElement;
		if (!boundingContainer) return;

		let innerHeight = 0;
		let thresholdCrossed = false;

		children.forEach((_child) => {
			const child = _child as HTMLElement;

			innerHeight += child.clientHeight ?? 0;

			if (thresholdCrossed || innerHeight > boundingContainer.clientHeight) {
				thresholdCrossed = true;
				child.remove();
			}
		});
	});
</script>

<div bind:this={container}>
	{@html formattedText}
</div>
