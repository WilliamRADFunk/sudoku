function _shuffle(input: number[]): number[];
function _shuffle(input: [number, number][]): [number, number][];
function _shuffle(input) {
    for (let i = input.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

export const shuffle = _shuffle;
