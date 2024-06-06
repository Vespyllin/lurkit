<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import Markdown from 'svelte-markdown';

	let { text, class: className }: { text: string; class?: string } = $props();

	const REDDIT_IMAGE_PREVIEW_REGEX =
		/https:\/\/preview\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)\?width=\d+&format=\w+&auto=\w+&s=\w+/g;
	const REDDIT_IMAGE_REGEX = /https:\/\/i\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)/g;

	const embedRedditPreview = (text: string) => text.replace(REDDIT_IMAGE_PREVIEW_REGEX, '![]($&)');
	const embedRedditImage = (text: string) => text.replace(REDDIT_IMAGE_REGEX, '![]($&)');
	const embedGiphy = (text: string) =>
		text.replace(
			/!\[gif\]\(giphy\|([\w-]+)\|?.*\)/g,
			'![](https://media.giphy.com/media/$1/giphy.gif)'
		);

	const embedMedia = (text: string) => embedRedditImage(embedRedditPreview(embedGiphy(text)));
</script>

<div
	class={cn(
		`	space-y-4
			[&_a]:inline-block [&_a]:text-blue-600 [&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800 
			[&_blockquote>*]:before:content-['“'] [&_blockquote>*]:after:content-['”'] [&_blockquote]:p-2 [&_blockquote]:text-zinc-400
			[&_img]:my-0.5 [&_img]:max-h-64 [&_img]:max-w-96
			[&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-2
			[&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-2`,
		className
	)}
>
	<Markdown source={embedMedia(cleanText(text))} />
</div>
