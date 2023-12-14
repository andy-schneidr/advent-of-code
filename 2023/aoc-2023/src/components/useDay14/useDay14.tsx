const empty = 0;
const square = 1;
const round = 2;

const convertToNumbers = (input: string[]): number[][] => {
  const platform: number[][] = [];
  for (let i = 0; i < input.length; i++) {
    let row: number[] = [];
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === ".") {
        row.push(empty);
      } else if (input[i][j] === "#") {
        row.push(square);
      } else if (input[i][j] === "O") {
        row.push(round);
      } else {
        console.log("Error - invalid input");
        return [];
      }
    }
    platform.push(row);
  }
  return platform;
};

const firstEmptySpaceNorthFromPos = (
  platform: number[][],
  row: number,
  column: number
): number => {
  for (let i = row - 1; i >= 0; i--) {
    if (platform[i][column] !== empty) {
      return i + 1;
    }
  }
  return 0;
};

const firstEmptySpaceSouthFromPos = (
  platform: number[][],
  row: number,
  column: number
): number => {
  for (let i = row + 1; i < platform.length; i++) {
    if (platform[i][column] !== empty) {
      return i - 1;
    }
  }
  return platform.length - 1;
};

// West is <<<<<<, remember?
const firstEmptySpaceWestFromPos = (
  platform: number[][],
  row: number,
  column: number
): number => {
  for (let i = column - 1; i >= 0; i--) {
    if (platform[row][i] !== empty) {
      return i + 1;
    }
  }
  return 0;
};

const firstEmptySpaceEastFromPos = (
  platform: number[][],
  row: number,
  column: number
): number => {
  for (let i = column + 1; i < platform[row].length; i++) {
    if (platform[row][i] !== empty) {
      return i - 1;
    }
  }
  return platform[row].length - 1;
};

const rollNorth = (platform: number[][]) => {
  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === round) {
        const newRow = firstEmptySpaceNorthFromPos(platform, i, j);
        platform[i][j] = empty;
        platform[newRow][j] = round;
      }
    }
  }
};

const rollWest = (platform: number[][]) => {
  for (let col = 0; col < platform[0].length; col++) {
    for (let row = 0; row < platform.length; row++) {
      if (platform[row][col] === round) {
        const newCol = firstEmptySpaceWestFromPos(platform, row, col);
        platform[row][col] = empty;
        platform[row][newCol] = round;
      }
    }
  }
};

const rollSouth = (platform: number[][]) => {
  for (let row = platform.length - 1; row >= 0; row--) {
    for (let col = 0; col < platform[row].length; col++) {
      if (platform[row][col] === round) {
        const newRow = firstEmptySpaceSouthFromPos(platform, row, col);
        platform[row][col] = empty;
        platform[newRow][col] = round;
      }
    }
  }
};

const rollEast = (platform: number[][]) => {
  for (let col = platform[0].length - 1; col >= 0; col--) {
    for (let row = 0; row < platform.length; row++) {
      if (platform[row][col] === round) {
        const newCol = firstEmptySpaceEastFromPos(platform, row, col);
        platform[row][col] = empty;
        platform[row][newCol] = round;
      }
    }
  }
};

const runCycle = (platform: number[][]) => {
  rollNorth(platform);
  rollWest(platform);
  rollSouth(platform);
  rollEast(platform);
};

const computeWeight = (platform: number[][]): number => {
  let sum = 0;
  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === round) {
        sum += platform.length - i;
      }
    }
  }
  return sum;
};

const findCycle = (
  results: number[]
): { cycleStart: number; cycleEnd: number } => {
  let cycleStart = 0;
  let cycleEnd = 0;
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      if (results[i] === results[j]) {
        cycleStart = i;
        cycleEnd = j;
        let isCycle = true;
        for (
          let c1 = cycleStart, c2 = cycleEnd;
          c2 < results.length;
          c1++, c2++
        ) {
          if (results[c1] !== results[c2]) {
            isCycle = false;
            break;
          }
        }

        if (isCycle) {
          return { cycleStart, cycleEnd };
        }
      }
    }
  }
  return { cycleStart: -1, cycleEnd: -1 };
};

const part1 = (input: string[]): string | number => {
  const platform = convertToNumbers(input);
  rollNorth(platform);
  return computeWeight(platform);
};

const part2 = (input: string[]): string | number => {
  const platform = convertToNumbers(input);

  const results = [];
  // IDK????? 250 is enough to find the cycle??
  for (let i = 0; i < 250; i++) {
    runCycle(platform);
    const weight = computeWeight(platform);
    // console.log(weight);
    results.push(weight);
  }

  // detect a cycle in the results
  const { cycleStart, cycleEnd } = findCycle(results);
  console.log(cycleStart, cycleEnd);

  // compute the cycle length
  const cycleLength = cycleEnd - cycleStart;

  const positionInCycle = (1000000000 - cycleStart) % cycleLength;
  const targetCycle = cycleStart + positionInCycle - 1;
  return results[targetCycle];
};

export default function useDay14() {
  return { part1, part2 };
}
