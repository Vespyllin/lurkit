<script lang="ts">
	import { AlertTriangle, Hash, Plus, Shield } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/alert-dialog/index.js';
	import { getContext } from 'svelte';

	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import { type Filter } from '$lib/db/filters';
	import { Trash } from 'radix-icons-svelte';
	import LoadingButton from '../layout/LoadingButton.svelte';
	import Button from '../ui/button/button.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let change = $state(false);
	let tab = $state('subreddit');
	const tabs = ['subreddit', 'keyword'];
	let displayFilters: Filter[] | undefined = $state(undefined);

	let searchString = $state('');

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	$effect(() => {
		displayFilters = $filterContext?.data ?? undefined;
	});
</script>

<Dialog.Root
	open={true}
	onOpenChange={(toOpen) => {
		if (!toOpen && change) $filterContext?.refetch();
		change = false;
	}}
>
	<Dialog.Trigger class="p-0.5">
		<Shield class="text-zinc-400 hover:text-zinc-100" />
	</Dialog.Trigger>
	<Dialog.Content
		class="py-3"
		preventScroll={false}
		escapeKeydownBehavior="close"
		interactOutsideBehavior="close"
	>
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Edit Filters</Dialog.Title>
			<Dialog.Description>
				<div class="flex space-x-2 pr-2">
					<h2 class="mb-3 mt-1 flex w-32 items-center space-x-2 text-xl font-semibold text-primary">
						<Shield className="h-5 w-5" /> <span class=" capitalize text-zinc-100">{tab}s</span>
					</h2>

					<div class="flex space-x-1">
						<input
							class="h-9 w-60 rounded-lg border border-input bg-background p-2 px-2.5 text-base text-zinc-100 placeholder:text-muted-foreground focus:border-accent focus-visible:outline-none"
							placeholder={`Add ${tab}`}
							bind:value={searchString}
						/>

						<Button
							class="size-9 p-2.5"
							disabled={searchString.length == 0 || true}
							onclick={() => {
								console.log('TODO: Submit');
								searchString = '';
							}}
						>
							<Plus size={25} />
						</Button>
					</div>

					<Button
						class="ml-auto size-9 p-2.5"
						onclick={() => {
							tab = tabs[(tabs.findIndex((x) => x == tab) + 1) % tabs.length];
						}}
					>
						<ChevronRight size={25} />
					</Button>
				</div>
				<div class="no-scrollbar mt-1 h-[500px] w-full space-y-2 overflow-auto">
					{#each displayFilters
						?.find((x) => x.type == tab)
						?.content.toReversed() ?? [] as bannedElement}
						<div
							class="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-2 py-1 transition-all duration-200 hover:border-border hover:bg-accent/15 hover:shadow-sm"
						>
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
								{#if tab == 'subreddit'}
									<Hash class="h-4 w-4 text-primary" />
								{:else}
									<AlertTriangle class="h-4 w-4 text-primary" />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p
									class="text-sm font-medium text-foreground transition-colors group-hover:text-accent-foreground"
								>
									{bannedElement}
								</p>
							</div>
							<LoadingButton
								variant="outline"
								class="size-10 p-2.5 hover:bg-background"
								onclick={async () => {
									const res = await fetch(`/api/filters/${tab}`, {
										method: 'DELETE',
										body: JSON.stringify({ [tab]: bannedElement })
									});

									const resJson = await res.json();

									if (res.status == 200 && resJson.success) {
										change = true;

										const newSubreddits = displayFilters!
											.find((x) => x.type == tab)
											?.content.filter((x) => x != bannedElement);

										if (newSubreddits !== undefined) {
											const oldFilters = displayFilters!.filter((x) => x.type !== tab);

											const update: Filter = { type: tab, content: newSubreddits };

											displayFilters = [...oldFilters, update];
										}
									}
								}}
							>
								<Trash size={25} />
							</LoadingButton>
						</div>
					{/each}
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
