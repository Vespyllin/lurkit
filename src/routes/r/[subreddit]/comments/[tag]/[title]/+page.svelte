<script lang="ts">
	import ListingHeader from '$lib/components/listing/ListingHeader.svelte';
	import ListingFooter from '$lib/components/listing/ListingFooter.svelte';
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import { CaretDown } from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import CommentChain from '$lib/components/listing/CommentChain.svelte';
	import ListingBody from '$lib/components/listing/ListingBody.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

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

	const getIcon = (post: Listing) => {
		const community_icon_src = post?.subreddit?.community_icon;
		return community_icon_src?.substring(0, community_icon_src?.indexOf('?'));
	};
</script>

<svelte:head>
	<title>{postData ? postData.listing.title : error}</title>
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
			<ListingHeader
				author={post.author}
				created_utc={post.created_utc}
				subreddit_icon={getIcon(post)}
				subreddit_name={post.subreddit.display_name}
			/>
			<ListingBody {post} expand />
			<ListingFooter
				score={post.score}
				num_comments={post.num_comments}
				upvote_ratio={post.upvote_ratio}
			/>
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
