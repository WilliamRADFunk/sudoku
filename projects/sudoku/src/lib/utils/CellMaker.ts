import { Cell } from '../models/cell';

export function CellMaker(
    value: number,
    position: [number, number, number],
    neighbors?: number[],
    isPrimer?: boolean,
    isParentClue?: boolean): Cell {
    return {
        clueByParent: !!isParentClue,
        flagValues: [],
        immutable: !!isPrimer,
        isClue: true,
        neighbors: neighbors || [],
        position,
        userAssignedValue: value || 0,
        value: value || 0
    };
}
