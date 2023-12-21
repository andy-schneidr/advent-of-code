type Point = {
  x: number;
  y: number;
};

type StepsLeft = number;

enum Space {
  PLOT,
  ROCK,
}

const parseInput = (input: string[]): { start: Point; grid: Space[][] } => {
  const start: Point = { x: 0, y: 0 };
  const grid: Space[][] = [];
  for (let i = 0; i < input.length; i++) {
    const row: Space[] = [];
    for (let j = 0; j < input[i].length; j++) {
      switch (input[i][j]) {
        case "#":
          row.push(Space.ROCK);
          break;
        case ".":
          row.push(Space.PLOT);
          break;
        case "S":
          start.y = i;
          start.x = j;
          row.push(Space.PLOT);
          break;
        default:
          throw new Error(`Unknown char ${input[i][j]}`);
      }
    }
    grid.push(row);
  }
  return { start, grid };
};

const North: Point = { x: 0, y: -1 };
const South: Point = { x: 0, y: 1 };
const East: Point = { x: 1, y: 0 };
const West: Point = { x: -1, y: 0 };

const AllDirections = [North, South, East, West];

const explore = (
  position: Point,
  lastPos: Point,
  grid: Space[][],
  stepsLeft: StepsLeft,
  memo: Map<string, { steps: number; reachableSpaces: Set<string> }>
): Set<string> => {
  const positionKey = `${position.x},${position.y}`;
  if (memo.has(positionKey)) {
    const memoEntry = memo.get(positionKey)!;
    if (memoEntry.steps >= stepsLeft) {
      // We've already been here with more steps, so no point exploring with fewer steps
      return memoEntry.reachableSpaces;
    }
  }

  const allReachedSpaces = new Set<string>();
  // We can only have gotten to this point if we had steps left,
  // and this position was valid
  if (stepsLeft % 2 === 0) {
    allReachedSpaces.add(positionKey);
  }
  if (stepsLeft > 0) {
    for (const direction of AllDirections) {
      const currentPos = {
        x: position.x,
        y: position.y,
      };
      const newPos = {
        x: position.x + direction.x,
        y: position.y + direction.y,
      };
      // Don't go back
      if (newPos.x === lastPos.x && newPos.y === lastPos.y) {
        continue;
      }
      if (
        newPos.x >= 0 &&
        newPos.x < grid[0].length &&
        newPos.y >= 0 &&
        newPos.y < grid.length
      ) {
        const space = grid[newPos.y][newPos.x];
        if (space === Space.PLOT) {
          const spaces = explore(newPos, currentPos, grid, stepsLeft - 1, memo);
          // combine this set with allReachedSpaces
          spaces.forEach((space) => allReachedSpaces.add(space));
        }
      }
    }
  }

  if (memo.has(positionKey)) {
    const memoEntry = memo.get(positionKey)!;
    if (memoEntry.steps < stepsLeft) {
      // we've explored this space with more steps, so we can update the memo
      memo.set(positionKey, {
        steps: stepsLeft,
        reachableSpaces: allReachedSpaces,
      });
    }
  } else {
    memo.set(positionKey, {
      steps: stepsLeft,
      reachableSpaces: allReachedSpaces,
    });
  }
  return allReachedSpaces;
};

const exploreInfinite = (
  position: Point,
  lastPos: Point,
  grid: Space[][],
  stepsLeft: StepsLeft,
  // memo: Map<string, { steps: number; reachableSpaces: Set<string> }>
  memo: Map<string, { steps: number }>,
  allReachedSpaces: Set<string>
): Set<string> => {
  const positionKey = `${position.x},${position.y}`;

  if (memo.has(positionKey)) {
    const memoEntry = memo.get(positionKey)!;
    if (memoEntry.steps >= stepsLeft) {
      // We've already been here with more steps, so no point exploring with fewer steps
      return allReachedSpaces;
    }
  }

  // We can only have gotten to this point if we had steps left,
  // and this position was valid
  if (stepsLeft % 2 === 0) {
    allReachedSpaces.add(positionKey);
  }
  if (stepsLeft > 0) {
    const len = grid[0].length;
    for (const direction of AllDirections) {
      const newPos = {
        x: position.x + direction.x,
        y: position.y + direction.y,
      };
      // Don't go back
      if (newPos.x === lastPos.x && newPos.y === lastPos.y) {
        continue;
      }
      const currentPos = {
        x: position.x,
        y: position.y,
      };
      const remappedPos = {
        x: ((newPos.x % len) + len) % len,
        y: ((newPos.y % len) + len) % len,
      };
      // console.log(`newPos ${newPos.x},${newPos.y}`);
      // console.log(`remappedPos ${remappedPos.x},${remappedPos.y}`);
      const space = grid[remappedPos.y][remappedPos.x];
      if (space === Space.PLOT) {
        // const spaces = exploreInfinite(
        exploreInfinite(
          newPos,
          currentPos,
          grid,
          stepsLeft - 1,
          memo,
          allReachedSpaces
        );
        // combine this set with allReachedSpaces
        // spaces.forEach((space) => allReachedSpaces.add(space));
      }
    }
  }
  if (memo.has(positionKey)) {
    const memoEntry = memo.get(positionKey)!;
    if (memoEntry.steps < stepsLeft) {
      // we've explored this space with more steps, so we can update the memo
      memo.set(positionKey, {
        steps: stepsLeft,
        // reachableSpaces: allReachedSpaces,
      });
    }
  } else {
    memo.set(positionKey, {
      steps: stepsLeft,
      // reachableSpaces: allReachedSpaces,
    });
  }
  return allReachedSpaces;
};

const part1 = (input: string[]): string | number => {
  const { start, grid } = parseInput(input);

  // Key to the memo is the current position and the number of steps left
  const memo = new Map<
    string,
    { steps: number; reachableSpaces: Set<string> }
  >();

  const reachableSpaces = explore(start, start, grid, 64, memo);
  return reachableSpaces.size;
};

const part2 = (input: string[]): string | number => {
  const { start, grid } = parseInput(input);

  /// ohhhh shit it's magic numbers time
  // UGH i hate this lmao
  const results: { steps: number; reachable: number }[] = [];
  for (let steps = 65; steps <= 327; steps += 131) {
    const allReachedSpaces = new Set<string>();
    const memo = new Map<string, { steps: number }>();

    const reachableSpaces = exploreInfinite(
      start,
      start,
      grid,
      steps,
      memo,
      allReachedSpaces
    );
    console.log(`${steps} ${reachableSpaces.size}`);
    results.push({ steps, reachable: reachableSpaces.size });
  }

  const derivative = [
    results[1].reachable - results[0].reachable,
    results[2].reachable - results[1].reachable,
  ];

  let spaces = results[2].reachable;
  let increase = derivative[1];
  const secondDir = derivative[1] - derivative[0];
  for (let i = results[2].steps; i < 26501365; i += 131) {
    increase += secondDir;
    spaces += increase;
  }
  return spaces;
};

export default function useDay21() {
  return { part1, part2 };
}
