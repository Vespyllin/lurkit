<script lang="ts">
	import {
		CaretDown,
		Star,
		Target,
		Update,
		Rocket,
		LightningBolt,
		Gear,
		Archive
	} from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { type ComponentType } from 'svelte';

	let {
		class: className,
		sort = $bindable(),
		onChange
	}: {
		sort: RedditCommentSortOption;
		onChange?: (v: RedditCommentSortOption) => void;
		class?: string;
	} = $props();

	const sortOptions: {
		option: RedditCommentSortOption;
		icon: ComponentType | undefined;
	}[] = [
		{ option: 'top', icon: Star },
		{ option: 'best', icon: Rocket },
		{ option: 'new', icon: LightningBolt },
		{ option: 'controversial', icon: Target },
		{ option: 'old', icon: Archive },
		{ option: 'hot', icon: Gear },
		{ option: 'random', icon: Update }
	];
</script>

<div class={className}>
	<DropdownMenu.Root preventScroll={false}>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
					<span class="ml-2 text-lg">{sort ?? 'default'}</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="space-y-0.5 bg-background font-['Ubuntu']">
			{#each sortOptions as sortOption}
				<DropdownMenu.Item
					class="cursor-pointer rounded-sm font-normal hover:bg-accent"
					onclick={() => {
						sort = sortOption.option;
						onChange?.(sort);
					}}
				>
					<sortOption.icon class="mr-1" />
					<span>{sortOption.option}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
