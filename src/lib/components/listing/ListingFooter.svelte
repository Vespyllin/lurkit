<script lang="ts">
	import { ArrowDown, ArrowUp, ChatBubble } from 'radix-icons-svelte';
	import Separator from '../ui/separator/separator.svelte';
	import { cn } from '$lib/utils';

	let { listing, class: className }: { listing: RedditT3Data; class?: string } = $props();
</script>

<div class={cn('flex gap-4 text-base font-medium text-zinc-200 md:gap-10', className)}>
	<div class="inline-flex items-center gap-1">
		<ArrowUp size={20} />
		<span>{listing.score.toLocaleString()}</span>
	</div>

	<div class="inline-flex items-center gap-1">
		<div class="flex">
			<ArrowUp size={20} />
			<div class="-ml-2 mt-auto">
				<ArrowDown size={14} />
			</div>
		</div>

		<span>{Math.round(listing.upvote_ratio * 100).toLocaleString()}%</span>
	</div>

	<div class="inline-flex items-center gap-1">
		<ChatBubble size={20} />
		<span class="ml-1">{listing.num_comments.toLocaleString()}</span>
	</div>

	<div class="hidden w-full items-center md:flex">
		<Separator class="h-0.5 bg-zinc-600" />
	</div>
</div>
