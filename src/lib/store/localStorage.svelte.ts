export class AudioLocalStorage {
	#key: string;
	#volume = $state(0);
	#muted = $state(true);

	constructor(key: string, defaultValue: number, defaultMuted: boolean) {
		this.#key = key;

		const localStorageVolume = localStorage.getItem(key + '-volume');
		const localStorageMuted = localStorage.getItem(key + '-muted');

		this.#volume = +(localStorageVolume ?? `${defaultValue}`);
		this.#muted = localStorageMuted !== undefined ? localStorageMuted == 'true' : defaultMuted;
	}

	get volume() {
		return this.#volume;
	}

	set volume(v: number) {
		localStorage.setItem(this.#key + '-volume', v.toString());
		this.#volume = v;
	}

	get muted() {
		return this.#muted;
	}

	set muted(v: boolean) {
		localStorage.setItem(this.#key + '-muted', v.toString());
		this.#muted = v;
	}
}

export const audioLocalStorage = new AudioLocalStorage('lurkit-audio', 25, true);
