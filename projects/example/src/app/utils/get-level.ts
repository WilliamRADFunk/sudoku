export const getLevel = (index: number): number => {
    if (!index) {
        return 1;
    }
    let remainder = index;
    for (let i = 1; i < this.levels; i++) {
        remainder -= Math.pow(9, i);
        if (remainder < 0) {
            return Math.max(i, 1);
        }
    }
};
