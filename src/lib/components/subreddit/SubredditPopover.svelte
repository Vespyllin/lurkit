<script lang="ts">
	import Markdown from '../media/Markdown.svelte';
	import * as Tooltip from '../ui/tooltip';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();

	const icon_url =
		(subreddit?.community_icon?.split('?')[0] ?? '').length > 0
			? subreddit?.community_icon?.split('?')[0]
			: (subreddit.icon_img ?? '').length > 0
				? subreddit.icon_img
				: '/favicon.png';

	const breakParagraph = (text: string) => {
		const words = text.split(' ');
		const lines: string[][] = [[]];

		let charsInLine = 0;
		let linesIdx = 0;
		words.forEach((word) => {
			if (charsInLine > Math.max(text.length / 5, 32) && linesIdx < 3) {
				linesIdx += 1;
				charsInLine = 0;
				lines.push([]);
			}

			lines[linesIdx].push(word);
			charsInLine += word.length;
		});

		return lines.map((x) => x.join(' '));
	};
</script>

<Tooltip.Root openDelay={50}>
	<Tooltip.Trigger>
		<a class="flex items-center gap-2 hover:underline" href={`/${subreddit.display_name_prefixed}`}>
			<img alt="" src={icon_url} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name_prefixed}
			</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content class="pt-1">
		<div class="flex h-fit min-w-64">
			<div class="mr-2 mt-[5px] flex h-[6.25rem] max-w-32">
				<img alt="" src={icon_url} class="my-auto h-full" />
			</div>

			<div>
				<a
					class="text-xl font-semibold tracking-tighter hover:underline"
					href={`/${subreddit.display_name_prefixed}`}
				>
					{subreddit.display_name_prefixed}
				</a>

				<div class="text-zinc-400">
					{#if !subreddit.public_description}
						No description.
					{:else}
						{@const x = breakParagraph(subreddit.public_description)}
						{#each x as line}
							<div>
								<Markdown text={line} />
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
