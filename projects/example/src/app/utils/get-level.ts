export const getLevel = (index: number, totalLevels: number): number => {
    if (!index) {
        return 1;
    }
    let remainder = index;
    for (let i = 1; i < totalLevels; i++) {
        remainder -= Math.pow(9, i);
        if (remainder < 0) {
            return Math.max(i, 1);
        }
    }
};
