import { pushKeywordFilter, removeKeywordFilter } from '$lib/db/filters';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { keyword } = await request.json();

	if (!keyword) return json({ error: 'Parameter is required' }, { status: 400 });

	const res = await pushKeywordFilter(keyword.toLowerCase());

	if (res == undefined) return json({ error: 'Internal Error' }, { status: 500 });

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { keyword } = await request.json();

	if (!keyword) return json({ error: 'Parameter is required' }, { status: 400 });

	const res = await removeKeywordFilter(keyword.toLowerCase());

	if (res == undefined) return json({ error: 'Internal Error' }, { status: 500 });

	return json({ success: true });
};
