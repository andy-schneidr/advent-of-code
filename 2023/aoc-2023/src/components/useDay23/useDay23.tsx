type Direction = {
  x: number;
  y: number;
};

const North: Direction = { x: 0, y: -1 };
const South: Direction = { x: 0, y: 1 };
const East: Direction = { x: 1, y: 0 };
const West: Direction = { x: -1, y: 0 };

const navigateUntilTurn = (
  input: string[],
  position: { x: number; y: number },
  currentDirection: Direction,
  end: { x: number; y: number },
  longest: { steps: number },
  longestPathMemo: Map<string, number>,
  visited: Set<string>,
  useSlopes: boolean
): Direction[] => {
  while (true) {
    const viableDirections: Direction[] = [];
    if (useSlopes) {
      // If we're on a <>v^, we must go in that direction
      if (input[position.y][position.x] === "<") {
        viableDirections.push(West);
      } else if (input[position.y][position.x] === ">") {
        viableDirections.push(East);
      } else if (input[position.y][position.x] === "^") {
        viableDirections.push(North);
      } else if (input[position.y][position.x] === "v") {
        viableDirections.push(South);
      }
    }
    if (viableDirections.length === 0) {
      for (const direction of [North, South, East, West]) {
        // can we go in this direction?
        let newPos = {
          x: position.x + direction.x,
          y: position.y + direction.y,
        };

        // If this position is off the board, skip
        if (
          newPos.y < 0 ||
          newPos.y >= input.length ||
          newPos.x < 0 ||
          newPos.x >= input[newPos.y].length
        ) {
          continue;
        }
        // If there's a forest at the new position, skip
        if (input[newPos.y][newPos.x] === "#") {
          continue;
        }

        // if there's a slope in the opposite direction in the new position, skip
        if (useSlopes) {
          // Can't go backwards up slopes
          if (input[newPos.y][newPos.x] === "<" && direction === East) {
            continue;
          }
          if (input[newPos.y][newPos.x] === ">" && direction === West) {
            continue;
          }
          if (input[newPos.y][newPos.x] === "v" && direction === North) {
            continue;
          }
          if (input[newPos.y][newPos.x] === "^" && direction === South) {
            continue;
          }
        }

        // If we've been there before, skip
        if (visited.has(`${newPos.x},${newPos.y}`)) {
          continue;
        }

        viableDirections.push(direction);
      }
    }
    if (viableDirections.length === 0) {
      // console.log("There's nowhere to go??? ", position);
      return [];
    }
    if (viableDirections.length !== 1) {
      // We've reached a point where there are two viable directions
      return viableDirections;
    }

    // Move in the only valid direction
    currentDirection = viableDirections[0];
    position.x += currentDirection.x;
    position.y += currentDirection.y;
    // steps++;

    const posKey = `${position.x},${position.y}`;

    // If we've been there before, we must have been forced into a previous position
    if (visited.has(posKey)) {
      return [];
    }
    const posDirectionKey = `${position.x},${position.y},${currentDirection.x},${currentDirection.y}`;

    visited.add(posKey);

    // Is this the *longest* path to this position?
    if (longestPathMemo.has(posDirectionKey)) {
      if (visited.size > longestPathMemo.get(posDirectionKey)!) {
        longestPathMemo.set(posDirectionKey, visited.size);
      } else if (visited.size + 5000 <= longestPathMemo.get(posDirectionKey)!) {
        return [];
      }
    } else {
      longestPathMemo.set(posDirectionKey, visited.size);
    }

    // are we at the end?
    if (position.x === end.x && position.y === end.y) {
      if (visited.size > longest.steps) {
        longest.steps = visited.size;
      }
      return [];
    }
  }
};

const findLongestPath = (
  input: string[],
  position: { x: number; y: number },
  currentDirection: Direction,
  end: { x: number; y: number },
  longest: { steps: number },
  longestPathMemo: Map<string, number>,
  visited: Set<string>,
  useSlopes: boolean
): void => {
  let posKey = `${position.x},${position.y}`;
  let posDirectionKey = `${position.x},${position.y},${currentDirection.x},${currentDirection.y}`;

  // Is this the *longest* path to this position?
  if (longestPathMemo.has(posDirectionKey)) {
    if (visited.size > longestPathMemo.get(posDirectionKey)!) {
      longestPathMemo.set(posDirectionKey, visited.size);
    } else if (visited.size + 5000 <= longestPathMemo.get(posDirectionKey)!) {
      return;
    }
  } else {
    longestPathMemo.set(posDirectionKey, visited.size);
  }

  visited.add(posKey);
  // are we at the end?
  if (position.x === end.x && position.y === end.y) {
    if (visited.size > longest.steps) {
      longest.steps = visited.size;
    }
    return;
  }

  // Get the next viable paths from here
  const viableDirections = navigateUntilTurn(
    input,
    position,
    currentDirection,
    end,
    longest,
    longestPathMemo,
    visited,
    useSlopes
  );
  if (viableDirections.length === 0) {
    // Must have hit a dead end or the end or something
    return;
  }

  for (const direction of viableDirections) {
    // Clone the position
    const newPos = {
      x: position.x + direction.x,
      y: position.y + direction.y,
    };
    const newDirection = {
      x: direction.x,
      y: direction.y,
    };
    // Clone the visited map
    const newVisited = new Set<string>(visited);
    findLongestPath(
      input,
      newPos,
      newDirection,
      end,
      longest,
      longestPathMemo,
      newVisited,
      useSlopes
    );
  }
};

const part1 = (input: string[]): string | number => {
  const start = {
    x: 1,
    y: 0,
  };

  const end = {
    x: input[0].length - 2,
    y: input.length - 1,
  };

  const longest = { steps: 0 };
  const longestPathMemo = new Map<string, number>();
  const visited = new Set<string>();

  const useSlopes = true;
  findLongestPath(
    input,
    start,
    South,
    end,
    longest,
    longestPathMemo,
    visited,
    useSlopes
  );

  return longest.steps - 1;
};

type Junction = {
  x: number;
  y: number;
  id: string;
  directions: Direction[];
  distances?: Map<string, number>;
};

const computeJunctionDistances = (
  input: string[],
  start: { x: number; y: number },
  end: { x: number; y: number },
  junctions: Map<string, Junction>
) => {
  // iterate over the map of junctions
  for (const junction of junctions.values()) {
    junction.distances = new Map<string, number>();
    // iterate over the directions of each junction
    for (const direction of junction.directions) {
      // navigate in that direction until we hit another junction
      // or the end
      let position = {
        x: junction.x + direction.x,
        y: junction.y + direction.y,
      };
      // Use the function navigateUntilTurn to wander down a path until we hit another junction.
      const visited = new Set<string>([
        `${junction.x},${junction.y}`,
        `${position.x},${position.y}`,
      ]);
      navigateUntilTurn(
        input,
        position,
        direction,
        end,
        { steps: 0 },
        new Map<string, number>(),
        visited,
        false
      );
      let id = `${position.x},${position.y}`;
      if (position.x === end.x && position.y === end.y) {
        id = "end";
      }
      if (position.x === start.x && position.y === start.y) {
        id = "start";
      }
      junction.distances.set(id, visited.size - 1);
    }
  }
};

const findAllJunctions = (input: string[]): Map<string, Junction> => {
  const junctions: Map<string, Junction> = new Map<string, Junction>();

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "#") {
        continue;
      }
      const viableDirections: Direction[] = [];

      for (const direction of [North, South, East, West]) {
        // can we go in this direction?
        let newPos = {
          x: j + direction.x,
          y: i + direction.y,
        };

        // If this position is off the board, skip
        if (
          newPos.y < 0 ||
          newPos.y >= input.length ||
          newPos.x < 0 ||
          newPos.x >= input[newPos.y].length
        ) {
          continue;
        }
        // If there's a forest at the new position, skip
        if (input[newPos.y][newPos.x] === "#") {
          continue;
        }
        viableDirections.push(direction);
      }
      if (viableDirections.length > 2) {
        junctions.set(`${j},${i}`, {
          x: j,
          y: i,
          id: `${j},${i}`,
          directions: viableDirections,
        });
      }
    }
  }
  return junctions;
};

const findMostExpensivePath = (
  allJunctions: Map<string, Junction>,
  junctionId: string,
  visited: Set<string>,
  currentCost: number,
  highestCost: { cost: number }
) => {
  const junction = allJunctions.get(junctionId)!;
  if (junction === undefined) {
    console.log(`Couldn't find junction ${junctionId}`);
    return;
  }
  if (junction.distances === undefined) {
    return;
  }
  // We have now visited this junction
  visited.add(junction.id);
  for (const [id, cost] of junction.distances.entries()) {
    // Can we go to this new junction?
    if (visited.has(id)) {
      continue;
    }
    // Add that many steps to the current cost
    const newCost = currentCost + cost;
    if (id === "end") {
      if (newCost > highestCost.cost) {
        highestCost.cost = newCost;
      }
      // Made it to the end, we can bail out.
      return;
    }

    // Go there
    const visitedCopy = new Set<string>(visited);
    findMostExpensivePath(allJunctions, id, visitedCopy, newCost, highestCost);
  }
};

const part2 = (input: string[]): string | number => {
  const start = {
    x: 1,
    y: 0,
  };

  const end = {
    x: input[0].length - 2,
    y: input.length - 1,
  };

  const junctions = findAllJunctions(input)!;

  computeJunctionDistances(input, start, end, junctions);

  // find the junction with a distance to id 'start'
  const currentJunctionId = Array.from(junctions.keys()).find((key) => {
    return junctions.get(key)!.distances!.has("start");
  })!;

  const highestCost = { cost: 0 };
  const visited = new Set<string>(["start"]);
  findMostExpensivePath(
    junctions,
    currentJunctionId,
    visited,
    junctions.get(currentJunctionId)!.distances!.get("start")!,
    highestCost
  );

  return highestCost.cost;
};

export default function useDay23() {
  return { part1, part2 };
}
