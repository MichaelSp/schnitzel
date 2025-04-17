// place files you want to import through the `$lib` alias in this folder.

export interface Position {
	latitude: number;
	longitude: number;
}

export interface ChallengeResult {
	timestamp: Date;
}

export interface ShipInfo {
	id: string;
	shipName?: string;
	location?: Position;
	status?: string;
	challenges?: ChallengeResult[];
	lastUpdated?: Date;
}

export type ShipInfos = Map<string, ShipInfo>;

// This function calculates the distance between two positions
export function distanceInMeter(pos1: Position | undefined, pos2: Position): number {
	if (!pos1) {
		return 0;
	}
	return Math.sqrt(
		Math.pow(pos1.latitude - pos2.latitude, 2) + Math.pow(pos1.longitude - pos2.longitude, 2)
	);
}
export function distanceInNM(pos1: Position | undefined, pos2: Position): number {
	if (!pos1) {
		return 0;
	}
	const distance = distanceInMeter(pos1, pos2);
	return distance / 1852; // 1 NM = 1852 m
}
