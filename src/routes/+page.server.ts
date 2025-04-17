import type { PageServerLoad, Actions } from './$types';
import type { ShipInfo } from '$lib';

const shipLocations: Record<string, ShipInfo> = {};

export const load: PageServerLoad = () => {
	return { shipLocations };
};
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

        const shipName = data.get('shipName');
        if (!shipName || typeof shipName !== 'string') {
            return;
        }
        const shipInfo = data.get('shipInfo');
        if (!shipInfo || typeof shipInfo !== 'string') {
            return;
        }
        const shipInfoObj = JSON.parse(shipInfo);

		shipLocations[shipName] = shipInfoObj;
        return {shipLocations};
	}
} satisfies Actions

