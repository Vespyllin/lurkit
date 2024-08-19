export const redditFetch = async <T>(url: string): Promise<ResultWrapper<T>> => {
	try {
		const fetchRes = await fetch(url);
		if (fetchRes.status != 200) {
			return {
				status: 'FAIL',
				reason: `Status ${fetchRes.status} ${!!fetchRes.statusText ? ':' + fetchRes.statusText : ''}`
			};
		}

		const fetchData: T = await fetchRes.json();

		return { status: 'OK', data: fetchData };
	} catch (e: any) {
		return {
			status: 'FAIL',
			reason: `Status 500: ${e.message}`
		};
	}
};
