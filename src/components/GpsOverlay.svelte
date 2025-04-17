<script lang="ts">
	import { onMount } from 'svelte';
	import Distances from './Distances.svelte';
	import LatLong from './LatLong.svelte';

	let {
		shipInfos,
		shipInfo,
		destination,
		range = 100, // in meters
		atDestination = $bindable()
	} = $props();

	let activeChallenge = $derived(shipInfo?.challenges?.length || 0);

	let position: GeolocationCoordinates | undefined = $state();
	let error: string | undefined = $state();

	onMount(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					position = pos.coords;
				},
				(e) => {
					error = `Unable to retrieve your location. Please check your browser settings. ${e.message}`;
				}
			);
		} else {
			error = 'Geolocation is not supported by this browser.';
		}
	});

	let distance = $derived(() => {
		if (!position || !destination) {
			return 'Loading...';
		}
		const dist = Math.sqrt(
			Math.pow(position.latitude - destination.latitude, 2) +
				Math.pow(position.longitude - destination.longitude, 2)
		);

		atDestination = dist < range;

		const nauticalMiles = dist * 0.539957; // Convert to nautical miles
		if (nauticalMiles < 1) {
			return `${(dist * 1000).toFixed(2)} m`;
		} else {
			return `${nauticalMiles.toFixed(2)} nm`;
		}
	});
</script>

<div class="overlay" class:atDestination>
	<h2 class="mdc-typography--headline4">HyperChallenge</h2>
	{#if error}
		<div style="color: red;">{error}</div>
	{:else}
		<LatLong {position} title="Position" />
	{/if}

	{#if destination}
		<LatLong position={destination} title="Destination" />

		<Distances {shipInfos} {activeChallenge} {destination}></Distances>

		<strong>Active Challenge {activeChallenge}</strong>
	{/if}
</div>

<style>
	.overlay {
		bottom: 1rem;
		right: 1rem;
		background: white;
		padding: 1rem;
		font-size: 0.9rem;
		min-width: 150px;
	}

	.overlay.atDestination {
		background: lightgreen;
	}
</style>
