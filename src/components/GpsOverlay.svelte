<script lang="ts">
	import { onMount } from 'svelte';

	let {
		destination,
		range = 100,
		atDestination = $bindable()
	} = $props();

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
		const dist = Math.sqrt(Math.pow(position.latitude - destination.latitude, 2)
			+ Math.pow(position.longitude - destination.longitude, 2));

		atDestination = dist < range;

		return `${dist} km`;
	});
</script>


<div class="overlay" class:atDestination={atDestination}>
	<strong>GPS Position:</strong>
	{#if error}
		<div style="color: red;">{error}</div>
	{:else}
		<div>Lat: {position?.latitude ?? 'Loading...'}</div>
		<div>Long: {position?.longitude ?? 'Loading...'}</div>
	{/if}

	{#if destination}
		<strong>Destination</strong>
		<div>Latitude: {destination.latitude}</div>
		<div>Longitude: {destination.longitude}</div>

		<div>Distance: {distance()}</div>
	{/if}
</div>

<style>
    .overlay {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: white;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 0.9rem;
        min-width: 150px;
    }

	.overlay.atDestination {
		background: lightgreen;
	}
</style>
