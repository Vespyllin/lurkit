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

<!-- <div
	class={cn(
		`flex flex-col gap-2 whitespace-pre text-wrap text-zinc-100
		[&_a]:inline-block [&_a]:text-blue-600
		[&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800 [&_blockquote>*]:before:content-['“'] [&_blockquote>*]:after:content-['”']
		[&_blockquote]:flex [&_blockquote]:gap-1 [&_blockquote]:p-2
		[&_blockquote]:text-zinc-400 [&_h1]:text-3xl [&_h1]:font-semibold
		[&_h2]:text-2xl [&_h2]:font-semibold 
		[&_h3]:text-xl [&_h3]:font-semibold 
		[&_img]:h-64 
		[&_li]:flex [&_li]:text-zinc-300 
		[&_ol>li]:before:pr-2 [&_ol>li]:before:content-['-'] [&_ol]:flex 
		[&_ol]:flex-col [&_ol]:gap-1 
		[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1`,
		className
	)}
>
	<Markdown md={embedMedia(cleanText(text))} />
</div> -->
<div
	class={cn(
		`	space-y-2 
			[&_a]:inline-block [&_a]:text-blue-600 [&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800 
			[&_img]:my-0.5 [&_img]:max-h-64 [&_img]:max-w-96
			[&_ol]:list-inside [&_ol]:list-decimal [&_ol]:pl-2
			[&_ul]:text-red-500 `,
		className
	)}
>
	<Markdown source={embedMedia(cleanText(text))} />
</div>
