import { writable } from 'svelte/store';

export function audioLocalStorage() {
	const audioKey = 'lurkit-audio';
	const { subscribe, update } = writable(+(localStorage.getItem(audioKey) ?? '50'));

	return {
		subscribe,
		update: (v: number) => {
			localStorage.setItem(audioKey, v.toString());
			update(() => v);
		}
	};
}
