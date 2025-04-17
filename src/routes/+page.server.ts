import type { ShipInfo } from '$lib';
import { getShipLocations, setShipInfo } from '$lib/server/database';
import { type Cookies } from '@sveltejs/kit';
import type { Actions } from './$types';

function getOrCreateShipIdFrom(cookies: Cookies) {
	let shipId = cookies.get('shipId');

	if (!shipId) {
		shipId = crypto.randomUUID();
		cookies.set('shipId', shipId, { path: '/' });
	}
	return shipId;
}

export function load({ cookies }) {
	return { shipInfos: getShipLocations(), shipId: getOrCreateShipIdFrom(cookies) };
}

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const shipId = getOrCreateShipIdFrom(cookies);

		const info: ShipInfo = {
			id: shipId
		};
		data.forEach((value, key) => {
			if (typeof value !== 'string') {
				return;
			}

			if (key === 'location') {
				const location = value.split(',').map((s) => s.trim());
				info[key] = {
					latitude: parseFloat(location[0]),
					longitude: parseFloat(location[1])
				};
			} else {
				info[key] = value;
			}
		});

		setShipInfo(shipId, info);

		return { shipInfos: getShipLocations(), shipId };
	}
} satisfies Actions;
