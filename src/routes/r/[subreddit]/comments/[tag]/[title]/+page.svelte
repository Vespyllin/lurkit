<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import { CaretDown } from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CommentChain from '$lib/components/listing/CommentChain.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';

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
	<title>{postData ? postData.listing.title : error ? error : 'Lurkit'}</title>
</svelte:head>

{#if !postData && fetching}
	<div class="mx-auto items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">LOADING</h1>
	</div>
{:else if !postData}
	<div class="mx-auto items-center justify-center space-y-2 p-32 lg:max-w-5xl">
		<div class="flex flex-col">
			<h1 class="text-center text-3xl">Could not reach Reddit servers.</h1>
			<h2 class="text-center text-xl">{error}</h2>
		</div>
	</div>
{:else}
	{@const { listing: post, comments } = postData}

	<div class="space-y-2">
		<div class="flex w-full flex-col gap-2 pb-4">
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
			<DropdownMenu.Content class="bg-background ">
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item>Billing</DropdownMenu.Item>
				<DropdownMenu.Item>Team</DropdownMenu.Item>
				<DropdownMenu.Item>Subscription</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<CommentChain {comments} root />
	</div>
{/if}
