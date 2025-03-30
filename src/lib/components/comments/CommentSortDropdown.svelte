<script lang="ts">
	import {
		CaretDown,
		Star,
		Target,
		Update,
		Rocket,
		LightningBolt,
		Gear,
		Archive,
		Keyboard
	} from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { type ComponentType } from 'svelte';

	let {
		class: className,
		sort = $bindable(),
		onChange
	}: {
		sort: RedditCommentSortOption | undefined;
		onChange?: (v: RedditCommentSortOption | undefined) => void;
		class?: string;
	} = $props();

	const sortOptions: {
		value: RedditCommentSortOption | 'default';
		display: string;
		icon: ComponentType | undefined;
	}[] = [
		{ value: 'default', display: 'default', icon: Gear },
		{ value: 'confidence', display: 'best', icon: Rocket },
		{ value: 'top', display: 'top', icon: Star },
		{ value: 'new', display: 'new', icon: LightningBolt },
		{ value: 'controversial', display: 'controversial', icon: Target },
		{ value: 'old', display: 'old', icon: Archive },
		{ value: 'random', display: 'random', icon: Update },
		{ value: 'qa', display: 'q&a', icon: Keyboard }
	];
</script>

<div class={className}>
	<DropdownMenu.Root>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
					<span class="ml-2 text-lg">
						{sortOptions.find((x) => x.value == (sort ?? 'default'))!.display}
					</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="space-y-0.5 bg-background font-['Montserrat']">
			{#each sortOptions as sortOption}
				{#if (sort == undefined ? 'default' : sort) !== sortOption.value}
					<DropdownMenu.Item
						class="cursor-pointer rounded-sm font-normal hover:bg-accent"
						onclick={() => {
							const x = sortOption.value == 'default' ? undefined : sortOption.value;
							sort = x;
							onChange?.(x);
						}}
					>
						<sortOption.icon class="mr-1" />
						<span>{sortOption.display}</span>
					</DropdownMenu.Item>
				{/if}
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
