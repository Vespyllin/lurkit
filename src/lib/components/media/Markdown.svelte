<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let { text, crop, class: classList }: { text: string; crop?: boolean; class?: string } = $props();
	const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s|-])*\.(png|jpg|jpeg|gif|bmp|svg|webp).*/g;
	const GIPHY_REGEX = /!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g;

	const wrapATagRegex = (regex: RegExp) => new RegExp(`<a href="(${regex.source})">\\1<\\/a>`, 'g');

	const formattedText = cleanText(text)
		.replaceAll(wrapATagRegex(IMAGE_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(wrapATagRegex(GIPHY_REGEX), '<a href="$1"><img src="$1"/></a>')
		.replaceAll(/(www|new).reddit.com/g, 'lurkit-six.vercel.app')
		.replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
		.replaceAll(/<a\b(?![^>]*\srel\s*=\s*['"]external['"])([^>]*)>/gi, '<a rel="external"$1>');

	let container: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!crop) return;

		const children = container?.childNodes[1].childNodes;
		if (!container || !children) return;

		const imgElements = container.querySelectorAll('img');

		imgElements.forEach((img) => img.parentElement?.remove());

		let innerHeight = 0;

		children.forEach((_child, idx) => {
			const child = _child as HTMLElement;
			// Hardcoded for space-y-8
			innerHeight += (child.clientHeight ?? -8) + 8;

			// Hardcoded for h-48
			if (child.clientHeight !== undefined && idx !== 0 && innerHeight > 192) {
				child.remove();
			}
		});
	});
</script>

<div class={cn(classList, crop && '[&>*]:max-h-48')} bind:this={container}>
	{@html formattedText}
</div>
