import { writable } from 'svelte/store';

export const localStorageNumberStore = (key: string, defaultValue?: number) => {
	const { subscribe, update } = writable(
		+(localStorage.getItem(key) ?? (defaultValue ? `${defaultValue}` : '0'))
	);

	return {
		subscribe,
		set: (v: number) => {
			localStorage.setItem(key, v.toString());
			update((_) => v);
		}
	};
};
