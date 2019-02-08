import { Cell } from '../models/cell';

export function CellMaker(
    value: number,
    position: [number, number, number],
    isPrimer?: boolean,
    isParentClue?: boolean): Cell {
    return {
        clueByParent: !!isParentClue,
        flagValues: [],
        hiddenByParent: !isParentClue,
        immutable: !!isPrimer,
        isClue: true,
        position,
        userAssignedValue: value || 0,
        value: value || 0
    };
}
