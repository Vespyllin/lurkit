<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import { CaretDown } from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CommentChain from '$lib/components/listing/CommentChain.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';

	const {
		params: { subreddit, tag, title }
	} = $page;

	let fetching = $state(true);
	let postData: PostData | undefined = $state();
	let error: string | undefined = $state();
	let sort: RedditSortOptions = 'top';

	$effect(() => {
		fetchPostData(`/r/${subreddit}/comments/${tag}/${title}/`, sort).then((data) => {
			if (data.status == 'OK') {
				postData = data.data;
			} else {
				error = data.reason;
			}
			fetching = false;
		});
	});
</script>

<svelte:head>
	<title>
		{postData
			? `${postData.listing.title} - ${postData.listing.subreddit.display_name}`
			: error
				? error
				: 'Loading...'}
	</title>
</svelte:head>

{#if !postData}
	<FetchStatus {fetching} {error} />
{:else}
	{@const { listing: post, comments } = postData}

	<div class="mx-auto flex max-w-4xl flex-col gap-2">
		<div class="flex flex-col gap-2 pb-4">
			<Listing {post} expand />
		</div>

		<Separator class="my-2" />

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div class="mt-4 flex leading-8">
					<span class="mr-2 text-lg">Sort by:</span>

					<div
						class="flex items-center rounded-sm text-zinc-400 hover:bg-zinc-800 hover:bg-opacity-55"
					>
						<span class="ml-2 text-lg">{sort}</span>
						<CaretDown size={18} />
					</div>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="bg-background">
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item>Billing</DropdownMenu.Item>
				<DropdownMenu.Item>Team</DropdownMenu.Item>
				<DropdownMenu.Item>Subscription</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<CommentChain {comments} root />
	</div>
{/if}
