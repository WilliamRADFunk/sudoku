export interface Cell {
    flagValues: number[];
    immutable: boolean;
	isClue: boolean;
	neighbors: number[];
	position: [number, number, number];
	userAssignedValue: number;
	value: number;
}
