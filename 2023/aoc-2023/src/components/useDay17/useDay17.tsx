type Direction = {
  x: number;
  y: number;
};

const North: Direction = { x: 0, y: -1 };
North.toString = () => "N";
const South: Direction = { x: 0, y: 1 };
South.toString = () => "S";
const East: Direction = { x: 1, y: 0 };
East.toString = () => "E";
const West: Direction = { x: -1, y: 0 };
West.toString = () => "W";

const convertInputToNumberArray = (input: string[]): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < input.length; i++) {
    result.push([]);
    for (let j = 0; j < input[i].length; j++) {
      result[result.length - 1].push(parseInt(input[i][j]));
    }
  }
  return result;
};

const convertInputToVisits = (input: string[]): Map<string, number>[][] => {
  const result: Map<string, number>[][] = [];
  for (let i = 0; i < input.length; i++) {
    result.push([]);
    for (let j = 0; j < input[i].length; j++) {
      result[result.length - 1].push(new Map<string, number>());
    }
  }
  return result;
};

const getShortestPathToLocation = (
  costs: Map<string, number>[][],
  position: { x: number; y: number }
) => {
  let lowestCost = Number.MAX_SAFE_INTEGER;

  for (const [, value] of costs[position.y][position.x]) {
    if (value < lowestCost) {
      lowestCost = value;
    }
  }
  return lowestCost;
};

const findShortestPath = (
  grid: number[][],
  costs: Map<string, number>[][],
  position: { x: number; y: number },
  end: { x: number; y: number },
  direction: Direction,
  currMoves: number,
  cost: number,
  maxCost: number,
  minMoves: number,
  maxMoves: number
) => {
  // Move in the current direction.
  const newPos = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };
  currMoves++;
  if (currMoves > maxMoves) {
    // Illegal move
    return;
  }

  // If this newPos is off the board, return
  if (
    newPos.y < 0 ||
    newPos.y >= grid.length ||
    newPos.x < 0 ||
    newPos.x >= grid[newPos.y].length
  ) {
    return;
  }

  // If we're at the end and haven't moved the minimum amount, I guess this is a failure
  if (newPos.x === end.x && newPos.y === end.y && currMoves < minMoves) {
    return;
  }

  // the new cost to get here is the current cost plus the cost at the current space
  const newCost = cost + grid[newPos.y][newPos.x];

  // If this cost is already more than the shortest amount to get to the end, return
  if (newCost > getShortestPathToLocation(costs, end) || newCost > maxCost) {
    return;
  }

  const visitCode = `${direction.toString()}${currMoves}`;
  if (
    !costs[newPos.y][newPos.x].has(visitCode) ||
    newCost < costs[newPos.y][newPos.x].get(visitCode)!
  ) {
    // Update the cost at this position
    costs[newPos.y][newPos.x].set(visitCode, newCost);
  } else if (newCost >= costs[newPos.y][newPos.x].get(visitCode)!) {
    // We've already found a better way to get here
    return;
  }

  // If we're at the end, return
  if (newPos.x === end.x && newPos.y === end.y) {
    return;
  }

  // Explore in the same direction, or left or right of the same direction
  let newDirections = [South, East, West, North].filter(
    (d) => !(d.x === -direction.x && d.y === -direction.y)
  );
  for (let i = 0; i < newDirections.length; i++) {
    // If we're going in a new direction, we must have moved the maximum moves in the old direction
    if (
      (newDirections[i].x !== direction.x ||
        newDirections[i].y !== direction.y) &&
      currMoves < minMoves
    ) {
      continue;
    }
    let moves =
      newDirections[i].x === direction.x && newDirections[i].y === direction.y
        ? currMoves
        : 0;
    findShortestPath(
      grid,
      costs,
      newPos,
      end,
      newDirections[i],
      moves,
      newCost,
      maxCost,
      minMoves,
      maxMoves
    );
  }
};

/**
 * Oh my GOD I had to implement this as a way to prune paths early because
 * I kept blowing past the call stack limit on the actual input lmao T___T
 */
const getNaiveShortestPath = (grid: number[][]): number => {
  let sum = 0;
  for (let row = 1; row < grid.length; row++) {
    for (let col = row - 1; col < row + 1 && col < grid[row].length; col++) {
      sum += grid[row][col];
    }
  }

  return sum;
};

const solve = (input: string[], min: number, max: number): string | number => {
  const grid = convertInputToNumberArray(input);

  // Okay need to keep track not only of the cost at a node,
  // but what direction we were going for how long at that node
  const costs = convertInputToVisits(input);

  const start = {
    x: 0,
    y: 0,
  };

  const end = {
    x: grid[0].length - 1,
    y: grid.length - 1,
  };

  const maxCost = getNaiveShortestPath(grid);

  // try going east and south
  findShortestPath(grid, costs, start, end, East, 0, 0, maxCost, min, max);
  findShortestPath(grid, costs, start, end, South, 0, 0, maxCost, min, max);
  let lowestCost = Number.MAX_SAFE_INTEGER;

  // iterate over the map at costs[input.length - 1][input[0].length - 1];
  for (const [, value] of costs[input.length - 1][input[0].length - 1]) {
    if (value < lowestCost) {
      lowestCost = value;
    }
  }
  console.log(lowestCost);
  return lowestCost;
};
const part1 = (input: string[]): string | number => {
  return solve(input, 0, 3);
};

const part2 = (input: string[]): string | number => {
  return solve(input, 4, 10);
};

export default function useDay17() {
  return { part1, part2 };
}
