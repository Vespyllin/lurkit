<script lang="ts">
	import { CaretDown } from 'radix-icons-svelte';
	import * as DropdownMenu from '../ui/dropdown-menu';
	import { cn } from '$lib/utils';

	let { sort = $bindable(), class: className }: { sort: RedditSortOptions; class?: string } =
		$props();

	const sortOptions: RedditSortOptions[] = ['top', 'controversial', 'new', 'hot', 'random'];
</script>

<div class={className}>
	<DropdownMenu.Root preventScroll={false}>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div
					class="flex items-center rounded-sm text-zinc-400 hover:bg-zinc-800 hover:bg-opacity-55"
				>
					<span class="ml-2 text-lg">{sort}</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="bg-background font-['Ubuntu']">
			{#each sortOptions as sortOption}
				<DropdownMenu.Item
					class={cn('cursor-pointer font-normal', sort == sortOption && 'bg-accent')}
					onclick={() => (sort = sortOption)}
				>
					{sortOption}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
