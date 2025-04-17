<script lang="ts">
	import { onMount } from 'svelte';

	let { shipName = $bindable() } = $props();

	let value = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (value && value.trim() !== '') {
			localStorage.setItem('shipName', shipName);
			shipName = value;
		}
	}

	onMount(() => {
		// Get the ship name from localStorage
		const storedShipName = localStorage.getItem('shipName');
		if (storedShipName) {
			shipName = storedShipName;
		}
	});
</script>


<form onsubmit={handleSubmit} class="mdc-form">
	<section>
		<label for="shipName">Enter your ship name:</label>
		<input class="mdc-form-field" type="text" bind:value={shipName} />
	</section>
	<button type="submit">OK</button>
</form>

<style>
    section {
        margin: 20px;
    }

    label {
        font-size: 1.2em;
        margin-right: 10px;
    }

    input {
        padding: 5px;
        font-size: 1em;
    }
</style>