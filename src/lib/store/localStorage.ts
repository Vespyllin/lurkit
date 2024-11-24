import { writable } from 'svelte/store';

const createVolumeLocalStorage = () => {
	const audioKey = 'lurkit-audio';
	const { subscribe, update } = writable(+(localStorage.getItem(audioKey) ?? '25'));

	return {
		subscribe,
		set: (v: number) => {
			localStorage.setItem(audioKey, v.toString());
			update((_) => v);
		}
	};
};

export const volumeLocalStorage = createVolumeLocalStorage();
