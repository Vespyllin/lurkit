import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllFilters } from '$lib/db/filters';

export const GET: RequestHandler = async () => {
	const subredditFilter = await getAllFilters();

	subredditFilter.map((x) => {
		return {
			type: x.type,
			content: x.content
		};
	});
	return json(subredditFilter);
};
