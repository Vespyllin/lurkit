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

	let inputString = $state('');
	let inputError = $state('');
	let inputLoading = $state(false);

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	$effect(() => {
		displayFilters = $filterContext?.data ?? undefined;
	});
</script>

<Dialog.Root
	onOpenChange={(toOpen) => {
		if (!toOpen && change) $filterContext?.refetch();
		change = false;
		tab = tabs[0];
		inputString = '';
		inputError = '';
	}}
>
	<Dialog.Trigger class="p-0.5">
		<Shield class="text-zinc-400 hover:text-zinc-100" />
	</Dialog.Trigger>
	<Dialog.Content
		class="w-[50lvw] p-2"
		preventScroll={false}
		escapeKeydownBehavior="close"
		interactOutsideBehavior="close"
	>
		<Dialog.Header class="w-full p-0">
			<Dialog.Title class="flex items-center space-x-2 text-2xl font-semibold text-primary">
				<Shield class="size-7" />
				<span class="text-zinc-100">
					Edit {tab.charAt(0).toUpperCase() + String(tab).slice(1)} Filters
				</span>
			</Dialog.Title>
			<Dialog.Description>
				<div class="mb-2 flex items-center justify-between space-x-2">
					<div class="flex w-full space-x-1">
						<input
							id="filter_input"
							disabled={inputLoading}
							class="h-10 w-full rounded-lg border border-input bg-background p-2 px-2.5 text-base text-zinc-100 placeholder:text-muted-foreground focus:border-accent focus-visible:outline-none"
							placeholder={`Add ${tab.charAt(0).toUpperCase() + String(tab).slice(1)}`}
							bind:value={inputString}
							onkeydown={(e) => {
								if (e.key == 'Enter') {
									e.preventDefault();
									document.getElementById('filter_submit')?.click();
								}
							}}
						/>

						<LoadingButton
							class="size-10 p-2.5"
							disabled={inputString.length == 0 ||
								(tab == 'subreddit' &&
									!(
										inputString.split('r/').length === 2 &&
										inputString.split('r/')[0]?.length == 0 &&
										inputString.split('r/')[1]?.length >= 1
									)) ||
								(displayFilters!.find((x) => x.type == tab)?.content ?? []).includes(inputString)}
							id="filter_submit"
							onclick={async () => {
								inputError = '';
								inputLoading = true;

								const res = await fetch(`/api/filters/${tab}`, {
									method: 'POST',
									body: JSON.stringify({ [tab]: inputString })
								});

								const resJson = await res.json();
								if (res.status == 200 || resJson.success) {
									const newContent = [
										...(displayFilters!.find((x) => x.type == tab)?.content ?? []),
										inputString
									];

									if (newContent !== undefined) {
										const oldFilters = displayFilters!.filter((x) => x.type !== tab);

										const update: Filter = { type: tab, content: newContent };

										displayFilters = [...oldFilters, update];
									}

									inputString = '';
									change = true;
								} else {
									inputError = resJson.error ?? 'Internal Error';
								}

								inputLoading = false;
							}}
						>
							<Plus size={25} />
						</LoadingButton>
					</div>

					<Button
						class="size-10 p-2.5"
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

										const newContent = displayFilters!
											.find((x) => x.type == tab)
											?.content.filter((x) => x != bannedElement);

										if (newContent !== undefined) {
											const oldFilters = displayFilters!.filter((x) => x.type !== tab);

											const update: Filter = { type: tab, content: newContent };

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
				<h3 class="mt-2 text-base text-red-600">{inputError}</h3>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
