<script lang="ts">
	import { cleanText } from '$lib';
	import Markdown from 'svelte-exmarkdown';

	let { text }: { text: string } = $props();

	const regexPattern =
		/https:\/\/preview\.redd\.it\/\w+\.(png|jpg|jpeg|gif|bmp|svg|webp)\?width=\d+&format=\w+&auto=\w+&s=\w+/g;

	const embedRedditImage = (text: string) => text.replace(regexPattern, '![]($&)');
</script>

<div
	class="	mt-2 flex flex-col gap-3 whitespace-pre text-wrap text-zinc-100
			[&_a]:inline-block [&_a]:text-blue-600 [&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800
			[&_blockquote>*]:before:content-['“'] [&_blockquote>*]:after:content-['”']
			[&_blockquote]:flex [&_blockquote]:gap-1 [&_blockquote]:border-b-4 [&_blockquote]:p-2 [&_blockquote]:text-zinc-400
			[&_img]:h-48
		"
>
	<Markdown md={embedRedditImage(cleanText(text))} />
</div>
