type Cords = {
  x: number;
  y: number;
  z: number;
};

type Brick = {
  aa: Cords;
  bb: Cords;
};

const droppableBrick = (idx: number, bricks: Brick[]): boolean => {
  if (bricks[idx].aa.z === 1) {
    return false;
  }
  let droppable = true;
  for (let i = 0; i < bricks.length; i++) {
    if (i === idx) {
      continue;
    }
    // Is any part of this bricks[i] directly below any part of bricks[idx]?
    if (bricks[i].bb.z === bricks[idx].aa.z - 1) {
      // idx is directly above i, will they actually collide?
      if (
        bricks[i].aa.x <= bricks[idx].bb.x &&
        bricks[i].bb.x >= bricks[idx].aa.x &&
        bricks[i].aa.y <= bricks[idx].bb.y &&
        bricks[i].bb.y >= bricks[idx].aa.y
      ) {
        droppable = false;
        break;
      }
    }
  }

  return droppable;
};

const dropBricks = (bricks: Brick[]): number => {
  // console.log("dropping bricks");
  // A block can drop further downward if there is no other block directly below
  // any of its blocks.
  let anyDropped = true;
  let bricksThatFell = new Set<number>();
  while (anyDropped) {
    anyDropped = false;
    for (let i = 0; i < bricks.length; i++) {
      if (droppableBrick(i, bricks)) {
        bricksThatFell.add(i);
        // console.log(`dropping brick ${i} to z level ${bricks[i].aa.z - 1}`);
        bricks[i].aa.z--;
        bricks[i].bb.z--;
        anyDropped = true;
      }
    }
  }
  // console.log("done dropping");
  return bricksThatFell.size;
};

const deepCloneBricks = (bricks: Brick[]): Brick[] => {
  const newBricks: Brick[] = [];
  for (let i = 0; i < bricks.length; i++) {
    newBricks.push({
      aa: { x: bricks[i].aa.x, y: bricks[i].aa.y, z: bricks[i].aa.z },
      bb: { x: bricks[i].bb.x, y: bricks[i].bb.y, z: bricks[i].bb.z },
    });
  }
  return newBricks;
};

const disintegrateableBricks = (bricks: Brick[]): number => {
  // For each brick, check if it is disintigratable.
  let disintigratable = 0;

  // A brick is disintigratable if no other bricks would fall further directly downward.
  for (let i = 0; i < bricks.length; i++) {
    // clone the brick array, excluding i
    const bricksClone = bricks.filter((brick, idx) => idx !== i);
    let canDisintigrate = true;
    for (let j = 0; j < bricksClone.length; j++) {
      if (droppableBrick(j, bricksClone)) {
        canDisintigrate = false;
        break;
      }
    }
    if (canDisintigrate) {
      disintigratable++;
    }
  }
  return disintigratable;
};

const bricksFallenFromDisintegrating = (bricks: Brick[]): number => {
  // For each brick, check if it is disintigratable.
  let totalFalls = 0;

  for (let i = 0; i < bricks.length; i++) {
    // BIG BRUTE FORCE TIME YEEEEEEEEEE HAWWWWWWWWWWWWWW
    // clone the brick array, excluding i
    const bricksClone = deepCloneBricks(bricks).filter(
      (brick, idx) => idx !== i
    );
    totalFalls += dropBricks(bricksClone);
  }
  return totalFalls;
};

const parseInput = (input: string[]): Brick[] => {
  const bricks: Brick[] = input.map((line) => {
    const parts = line.split("~");
    // split each part into x y z coords on commas
    const xyz1 = parts[0].split(",").map((n) => parseInt(n, 10));
    const xyz2 = parts[1].split(",").map((n) => parseInt(n, 10));
    return {
      aa: { x: xyz1[0], y: xyz1[1], z: xyz1[2] },
      bb: { x: xyz2[0], y: xyz2[1], z: xyz2[2] },
    };
  });

  return bricks.sort((a, b) => a.aa.z - b.aa.z);
};

const part1 = (input: string[]): string | number => {
  const bricks: Brick[] = parseInput(input);

  dropBricks(bricks);

  return disintegrateableBricks(bricks);
};

const part2 = (input: string[]): string | number => {
  const bricks: Brick[] = parseInput(input);

  dropBricks(bricks);

  return bricksFallenFromDisintegrating(bricks);
};

export default function useDay22() {
  return { part1, part2 };
}
