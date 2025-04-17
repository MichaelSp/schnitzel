import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		headers: {
			'Access-Control-Allow-Origin': 'https://schnitzel.sprauer.net'
		}
	}
};

export default config;
