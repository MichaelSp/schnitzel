<script lang="ts">
	import 'material-components-web/dist/material-components-web.min.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main>
	{@render children()}
</main>