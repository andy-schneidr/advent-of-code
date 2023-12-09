const buildHistoryPyramidThing = (history: number[]): number[][] => {
  const historyPyramid: number[][] = [];
  historyPyramid.push(history);

  let currentRung = 0;
  while (historyPyramid[currentRung].some((num) => num !== 0)) {
    let nextRung: number[] = [];
    for (let i = 0; i < historyPyramid[currentRung].length - 1; i++) {
      nextRung.push(
        historyPyramid[currentRung][i + 1] - historyPyramid[currentRung][i]
      );
    }
    historyPyramid.push(nextRung);
    currentRung++;
  }
  return historyPyramid;
};

const getNextValue = (history: number[]): number => {
  const historyTree: number[][] = buildHistoryPyramidThing(history);

  // Work backwards and add one to all previous rungs
  let lastValue = 0;
  for (let i = historyTree.length - 2; i >= 0; i--) {
    lastValue = historyTree[i][historyTree[i].length - 1] + lastValue;
  }
  return lastValue;
};

const getFirstValue = (history: number[]): number => {
  const historyTree: number[][] = buildHistoryPyramidThing(history);

  // Work backwards and add one to the beginning of all previous rungs
  let lastValue = 0;
  for (let i = historyTree.length - 2; i >= 0; i--) {
    lastValue = historyTree[i][0] - lastValue;
  }
  return lastValue;
};

const part1 = (input: string[]): string | number => {
  let nextHistories: number[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    const history = input[i].split(" ").map((num) => parseInt(num));

    nextHistories.push(getNextValue(history));
  }
  return nextHistories.reduce((a, b) => a + b, 0);
};

const part2 = (input: string[]): string | number => {
  let nextHistories: number[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    const history = input[i].split(" ").map((num) => parseInt(num));
    nextHistories.push(getFirstValue(history));
  }
  return nextHistories.reduce((a, b) => a + b, 0);
};

export default function useDay9() {
  return { part1, part2 };
}
