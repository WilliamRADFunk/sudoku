export interface Cell {
    clueByParent?: boolean;
    flagValues: number[];
    hiddenByParent?: boolean;
    immutable: boolean;
    isClue: boolean;
    locked?: boolean;
	position: [number, number, number];
	userAssignedValue: number;
	value: number;
}
