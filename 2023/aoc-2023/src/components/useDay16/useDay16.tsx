type Direction = {
  x: number;
  y: number;
};

type Visit = {
  directions: Direction[];
};

const North: Direction = { x: 0, y: -1 };
const South: Direction = { x: 0, y: 1 };
const East: Direction = { x: 1, y: 0 };
const West: Direction = { x: -1, y: 0 };

const explore = (
  input: string[],
  position: { x: number; y: number },
  direction: Direction,
  visited: Visit[][]
) => {
  // Go in the direction
  let newPos = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };

  // If this position is off the board, return
  if (
    newPos.y < 0 ||
    newPos.y >= input.length ||
    newPos.x < 0 ||
    newPos.x >= input[newPos.y].length
  ) {
    return;
  }

  if (visited[newPos.y][newPos.x].directions.includes(direction)) {
    return;
  }

  visited[newPos.y][newPos.x].directions.push(direction);

  switch (input[newPos.y][newPos.x]) {
    case "\\":
      direction = { x: direction.y, y: direction.x };
      explore(input, newPos, direction, visited);
      break;
    case "/":
      direction = { x: -direction.y, y: -direction.x };
      explore(input, newPos, direction, visited);
      break;
    case "-":
      if (direction.y !== 0) {
        explore(input, newPos, East, visited);
        explore(input, newPos, West, visited);
      } else {
        explore(input, newPos, direction, visited);
      }
      break;
    case "|":
      if (direction.x !== 0) {
        explore(input, newPos, North, visited);
        explore(input, newPos, South, visited);
      } else {
        explore(input, newPos, direction, visited);
      }
      break;
    case ".":
      // Keep going in the same direction
      explore(input, newPos, direction, visited);
      break;

    default:
      console.log("Error - unknown input: ", input[newPos.y][newPos.x]);
      break;
  }
};

const textExploration = (
  input: string[],
  position: { x: number; y: number },
  direction: Direction
) => {
  const visited: Visit[][] = [];
  for (let i = 0; i < input.length; i++) {
    visited.push([]);
    for (let j = 0; j < input[i].length; j++) {
      visited[i].push({ directions: [] });
    }
  }

  explore(input, position, direction, visited);

  let visits = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (visited[i][j].directions.length > 0) {
        visits++;
      }
    }
  }
  return visits;
};

const part1 = (input: string[]): string | number => {
  const position = { x: -1, y: 0 };
  const direction = East;

  return textExploration(input, position, direction);
};

const part2 = (input: string[]): string | number => {
  let best = 0;

  // Top down
  for (let i = 0; i < input.length; i++) {
    const position = { x: i, y: -1 };
    const direction = South;
    const visits = textExploration(input, position, direction);
    if (visits > best) {
      best = visits;
    }
  }
  // Bottom Up
  for (let i = 0; i < input.length; i++) {
    const position = { x: i, y: input.length };
    const direction = North;
    const visits = textExploration(input, position, direction);
    if (visits > best) {
      best = visits;
    }
  }

  // West to East
  for (let i = 0; i < input[0].length; i++) {
    const position = { x: -1, y: i };
    const direction = East;
    const visits = textExploration(input, position, direction);
    if (visits > best) {
      best = visits;
    }
  }

  // East to West
  for (let i = 0; i < input[0].length; i++) {
    const position = { x: input[0].length, y: i };
    const direction = West;
    const visits = textExploration(input, position, direction);
    if (visits > best) {
      best = visits;
    }
  }
  return best;
};

export default function useDay16() {
  return { part1, part2 };
}
