import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		warningFilter: (warning) => {
			const ignore = [
				'a11y_media_has_caption',
				'a11y_no_redundant_roles',
				'a11y_consider_explicit_label',
				'a11y_no_noninteractive_tabindex',
				'a11y_click_events_have_key_events',
				'a11y_no_static_element_interactions',
				'a11y_no_noninteractive_element_interactions',
				'state_referenced_locally'
			];
			return !ignore.includes(warning.code);
		}
	},

	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@/*': './path/to/lib/*'
		}
	}
};

export default config;
