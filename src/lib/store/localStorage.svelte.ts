export class AudioLocalStorage {
	#key: string;
	#muted = $state(true);

	constructor(key: string, defaultMuted: boolean) {
		this.#key = key;

		const localStorageMuted = localStorage.getItem(key + '-muted');

		if (!localStorageMuted) {
			localStorage.setItem(this.#key + '-muted', 'true');
			this.#muted = defaultMuted;
		} else {
			this.#muted = localStorageMuted == 'true';
		}
	}

	get muted() {
		return this.#muted;
	}

	set muted(v: boolean) {
		localStorage.setItem(this.#key + '-muted', v.toString());
		this.#muted = v;
	}
}

export const audioLocalStorage = new AudioLocalStorage('lurkit-audio', true);
