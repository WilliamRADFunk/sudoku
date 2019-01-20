export interface Cell {
    clueByParent?: boolean;
    flagValues: number[];
    immutable: boolean;
    isClue: boolean;
    locked?: boolean;
	neighbors: number[];
	position: [number, number, number];
	userAssignedValue: number;
	value: number;
}
