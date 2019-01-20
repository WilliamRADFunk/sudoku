import { Cell } from './cell';

export interface Board {
    cellStates: Cell[][];
    isSolved: boolean;
    level: number;
    parentQuadrant: number;
}
