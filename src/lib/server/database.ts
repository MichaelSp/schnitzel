import type { ShipInfo, ShipInfos } from '$lib';

const db = new Map<string, ShipInfo>([
	[
		'ship1',
		{
			id: 'ship1',
			shipName: 'Ship One',
			location: { latitude: 27.2522, longitude: 78.0 },
			status: 'active',
			challenges: []
		}
	],
	[
		'c6897a57-34b6-473e-9537-0638601ebb1f',
		{
			id: 'c6897a57-34b6-473e-9537-0638601ebb1f',
			shipName: 'ich'
		}
	]
]);

const subscribers = new Set<(data: ShipInfos) => void>();

export function onDatabaseChange(callback: (data: ShipInfos) => void) {
	subscribers.add(callback);

	return () => {
		subscribers.delete(callback);
	};
}

export function getShipLocations(): ShipInfos {
	return db;
}

export function setShipInfo(shipId: string, shipInfo: ShipInfo) {
	if (!db.has(shipId)) {
		db.set(shipId, { id: shipId });
	}
	const ship = db.get(shipId);
	if (ship) {
		Object.assign(ship, shipInfo);
	}
	subscribers.forEach((callback) => {
		callback(db);
	});
	return db;
}
