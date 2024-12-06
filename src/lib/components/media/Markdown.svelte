<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let { text, crop, class: classList }: { text: string; crop?: boolean; class?: string } = $props();
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

		let thresholdCrossed = false;
		let innerHeight = 0;

		children.forEach((_child, idx) => {
			const child = _child as HTMLElement;

			// Hardcoded for space-y-8
			innerHeight += (child.clientHeight ?? -8) + 8;

			if (child.clientHeight !== undefined) {
				// Hardcoded for h-48
				if (idx !== 0 && (thresholdCrossed || innerHeight > 192)) {
					thresholdCrossed = true;
					child.remove();
				}
			}
		});
	});
</script>

<div class={cn(classList, crop && '[&>*]:max-h-48')} bind:this={container}>
	{@html formattedText}
</div>
