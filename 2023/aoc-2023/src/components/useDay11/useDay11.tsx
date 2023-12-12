type Pos = {
  x: number;
  y: number;
};

const getDistancesWithExpansionFactor = (
  input: string[],
  expansionFactor: number
): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }

  const emptyCols = new Set<number>();
  const emptyRows = new Set<number>();
  const poss: Pos[] = [];

  for (let c = 0; c < input[0].length; c++) {
    let emptyCol = true;
    for (let r = 0; r < input.length; r++) {
      if (!input[r].includes("#")) {
        emptyRows.add(r);
      }
      if (input[r][c] === "#") {
        poss.push({ x: c, y: r });
        emptyCol = false;
      }
    }
    if (emptyCol) {
      emptyCols.add(c);
    }
  }

  // For each location, find the closest other location
  let totalDist = 0;
  for (let i = 0; i < poss.length; i++) {
    for (let j = i + 1; j < poss.length; j++) {
      let directionX = poss[i].x > poss[j].x ? -1 : 1;
      for (let x = poss[i].x; x !== poss[j].x; x += directionX) {
        totalDist += emptyCols.has(x) ? expansionFactor : 1;
      }

      let directionY = poss[i].y > poss[j].y ? -1 : 1;
      for (let y = poss[i].y; y !== poss[j].y; y += directionY) {
        totalDist += emptyRows.has(y) ? expansionFactor : 1;
      }
    }
  }
  return totalDist;
};

const part1 = (input: string[]): string | number => {
  return getDistancesWithExpansionFactor(input, 2);
};

const part2 = (input: string[]): string | number => {
  return getDistancesWithExpansionFactor(input, 1000000);
};

export default function useDay11() {
  return { part1, part2 };
}
