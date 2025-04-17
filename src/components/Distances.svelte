<script lang="ts">
	import type { Position, ShipInfo, ShipInfos } from '$lib';
	import { distanceInMeter, distanceInNM } from '$lib';
	import type { PageProps } from './$types';
	import { page } from '$app/state';

	let { shipInfos, destination, activeChallenge }: PageProps = $props();

	function isInCurrentChallenge(shipInfo: ShipInfo): boolean {
		return (shipInfo.challenges?.length || 0) === activeChallenge;
	}

	let shipsInCurrentChallenge: ShipInfo[] = $derived([...shipInfos.values()].filter(isInCurrentChallenge));
	let shipsNotInCurrentChallenge: ShipInfo[] = $derived([...shipInfos.values()].filter(shipInfo => !isInCurrentChallenge(shipInfo)));

	let maxDistance = $derived(shipsInCurrentChallenge.reduce((max, shipInfo) => {
		if (shipInfo.location) {
			const distance = distanceInMeter(shipInfo.location, destination);
			return Math.max(max, distance);
		}
		return max;
	}, 0));

	function hasNoLocation(shipInfo: ShipInfo): boolean {
		return !shipInfo.location;
	}

	let shipsWithNoLocation = 0;

	function relativeLoc(location?: Position): { lat: number, lon: number } {
		// Assuming the map is a square and the center is at (100, 100)
		// The map is 200x200 pixels
		// Convert the location to a relative position on the map
		// Based on the distance of all participants
		if (!location) {
			return { lat: 10, lon: 10 + shipsWithNoLocation++ * 20 };
		}

		const lat = (location.latitude - destination.latitude) / maxDistance * 100 + 100;
		const lon = (location.longitude - destination.longitude) / maxDistance * 100 + 100;
		return { lat, lon };
	}

    function onclick() {
        shipsInCurrentChallenge.forEach(shipInfo => {
            if (shipInfo.location) {
                shipInfo.location.latitude += (destination.latitude - shipInfo.location.latitude);
                shipInfo.location.longitude += (destination.longitude - shipInfo.location.longitude);
            }
            fetch(`./ship`, {
                method: 'POST',
                body: JSON.stringify(shipInfo),
                headers: {
                    'Content-Type': 'application/json'
                }
               
            }).then(response => {
                if (!response.ok) {
                    console.error('Error updating ship location:', response.statusText);
                } else {
                    console.log('Ship location updated successfully');
                    page.data.shipInfos = response.json();
                }
            }).catch(error => {
                console.error('Error updating ship location:', error);
            });
        });
    }
</script>

<ul class="mdc-list">
	{#each shipsInCurrentChallenge as shipInfo}
		<li class="mdc-list-item">
            <span class="mdc-list-item__graphic">
                <img src="/ship.svg" alt="{shipInfo.shipName}" width="20" height="20" />
            </span>
			<span class="mdc-list-item__text">
                <b>{shipInfo.shipName}</b> - is in challenge <b>{shipInfo.challenges?.length || 0}</b>
            </span>
		</li>
	{/each}
</ul>


<div class="map" {onclick}>
	<div class="center">
		<img src="/logo.svg" alt="Logo" width="10" height="10" />
	</div>
	{#each shipsInCurrentChallenge as shipInfo}
		<div class="ship" class:noLocation={hasNoLocation(shipInfo)}
				 style="top: {relativeLoc(shipInfo.location).lat}px; left: {relativeLoc(shipInfo.location).lon}px;">
			<img src="/ship.svg" alt="{shipInfo.shipName}" width="20" height="20" />
			<span><b>{shipInfo.shipName}</b> {distanceInNM(shipInfo.location, destination).toFixed(2)} nm</span>
		</div>
	{/each}
</div>

<style>
    .map {
        width: 200px;
        height: 200px;
        background-color: lightblue;
        position: relative;
        overflow: hidden;
        padding: 3rem;
    }

    .center {
        width: 10px;
        height: 10px;
        position: absolute;
        border-radius: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .ship {
        fill: green;
        position: absolute;
        text-wrap: none;
        overflow: visible;
        transform: translate(-50%, -50%);
        transition: top 0.5s ease, left 0.5s ease;
    }

    .ship.noLocation {
        background-color: rgb(233, 244, 24);
    }
</style>