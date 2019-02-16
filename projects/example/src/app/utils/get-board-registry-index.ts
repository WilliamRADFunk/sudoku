import { BoardOverlordService } from 'sudoku';
import { getLevel } from './get-level';

export const getBoardRegistryIndex = (index: number, totalLevels: number, svc: BoardOverlordService): number => {
    if (!index) {
        return 0;
    } else if (getLevel(index, totalLevels) > 1) {
        let totalSubstracted = 0;
        const lvlAbove = getLevel(index, totalLevels) - 1;
        for (let i = lvlAbove; i > 0; i--) {
            totalSubstracted += svc.getLevelLength(i);
        }
        return Math.abs(index - totalSubstracted);
    } else {
        return Math.abs(index + 1 - svc.getLevelLength(getLevel(index, totalLevels) - 1));
    }
};
