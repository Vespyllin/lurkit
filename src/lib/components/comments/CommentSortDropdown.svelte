<script lang="ts">
	import { CaretDown, Star, Target, Update, Rocket, LightningBolt } from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ComponentType } from 'svelte';
	import { cn } from '$lib/utils';

	let { sort = $bindable(), class: className }: { sort: RedditSortOptions; class?: string } =
		$props();

	const sortOptions: { option: RedditSortOptions; icon: ComponentType | undefined }[] = [
		{ option: 'top', icon: Star },
		{ option: 'controversial', icon: Target },
		{ option: 'new', icon: LightningBolt },
		{ option: 'hot', icon: Rocket },
		{ option: 'random', icon: Update }
	];
</script>

<div class={className}>
	<DropdownMenu.Root preventScroll={false}>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
					<span class="ml-2 text-lg">{sort}</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="space-y-0.5 bg-background font-['Ubuntu']">
			{#each sortOptions as sortOption}
				<DropdownMenu.Item
					class="cursor-pointer rounded-sm font-normal hover:bg-accent"
					onclick={() => (sort = sortOption.option)}
				>
					<svelte:component this={sortOption.icon} class="mr-1" />
					<span>{sortOption.option}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
