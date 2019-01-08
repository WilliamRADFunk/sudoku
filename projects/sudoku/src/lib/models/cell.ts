export interface Cell {
	flagValues: number[];
	isClue: boolean;
	neighbors: number[];
	position: [number, number, number];
	userAssignedValue: number;
	value: number;
}
