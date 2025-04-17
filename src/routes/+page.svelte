<script lang="ts">
	import type { Position, ShipInfo, ShipInfos } from '$lib';
	import AskShipName from '../components/AskShipName.svelte';
	import GpsOverlay from '../components/GpsOverlay.svelte';
	import type { PageProps } from './$types';

	import { source } from 'sveltekit-sse';

	let { data }: PageProps = $props();

	const newData = source('/subscribe')
		.select('message')
		.subscribe((event) => {
			console.log('Event:', event);
			if (event.data) {
				data = JSON.parse(event.data);
			}
		});

	let shipInfos: ShipInfos = $derived(data.shipInfos);
	let shipInfo: ShipInfo | undefined = $derived(data.shipInfos.get(data.shipId));
	let shipName = $derived(shipInfo?.shipName);
	$effect(() => {
		console.log('ShipInfos:', data);
		console.log('ShipId:', data.shipId);
		console.log('ShipName', data.shipInfos?.get(data.shipId));
	});

	let startPosition: Position = {
		latitude: 27.16,
		longitude: 78.043
	};

	let atDestination = $state(false);
</script>

{#if !shipName}
	<AskShipName />
{:else}
	<GpsOverlay {shipInfos} {shipInfo} destination={startPosition} {atDestination} />

	<button class="mdc-button mdc-button--raised" disabled={atDestination}>
		<span class="mdc-button__label">Skip This Challenge</span>
	</button>
	<button class="mdc-button mdc-button--raised" disabled={!atDestination}>
		<span class="mdc-button__label">Next Challenge</span>
	</button>
{/if}
