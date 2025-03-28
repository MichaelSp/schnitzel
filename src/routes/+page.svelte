<script lang="ts">
	import Map from 'leaflet';
	import { onMount } from 'svelte';

	onMount(() => {
		let map = Map.map('map').setView([51.505, -0.09], 13); // Default coordinates and zoom level
		Map.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	});
</script>

<div id="map"></div>

<style>
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
