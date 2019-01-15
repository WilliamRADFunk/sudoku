import { Cell } from '../models/cell';

export function CellMaker(
    value: number,
    position: [number, number, number],
    neighbors?: number[],
    isPrimer?: boolean): Cell {
    return {
        flagValues: [],
        immutable: !!isPrimer,
        isClue: true,
        neighbors: neighbors || [],
        position,
        userAssignedValue: 0,
        value: value || 0
    };
}
