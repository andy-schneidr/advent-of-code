type Inst = {
  dir: string;
  num: number;
};

const part1 = (input: string[]): string | number => {
  const instructions: Inst[] = [];
  for (let i = 0; i < input.length; i++) {
    const inst = input[i].split(" ");
    instructions.push({
      dir: inst[0],
      num: parseInt(inst[1]),
    });
  }

  const points = convertToPoints(instructions);
  const perimeter = getPerimeter(instructions);
  return shoeLaceArea(points) + perimeter / 2 + 1;
};

// UUUGHHH FIIIIINE I'LL DO IT THE SMART WAY >:(
const shoeLaceArea = (points: { x: number; y: number }[]): number => {
  let area = 0;
  let n = points.length;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
};

const getPerimeter = (instructions: Inst[]): number => {
  let perimeter = 0;
  for (let i = 0; i < instructions.length; i++) {
    perimeter += instructions[i].num;
  }
  return perimeter;
};

const convertToPoints = (instructions: Inst[]): { x: number; y: number }[] => {
  let horizontal = 0;
  let vertical = 0;
  const points: { x: number; y: number }[] = [];
  points.push({ x: horizontal, y: vertical });
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].dir === "R") {
      horizontal += instructions[i].num;
    } else if (instructions[i].dir === "L") {
      horizontal -= instructions[i].num;
    } else if (instructions[i].dir === "U") {
      vertical += instructions[i].num;
    } else if (instructions[i].dir === "D") {
      vertical -= instructions[i].num;
    }
    points.push({ x: horizontal, y: vertical });
  }
  return points;
};

const part2 = (input: string[]): string | number => {
  const instructions: Inst[] = [];
  for (let i = 0; i < input.length; i++) {
    const inst = input[i].split("#");
    const dist = inst[1].substring(0, 5);
    const dir = inst[1].substring(5, 6);
    let actualDir = "";
    if (dir === "0") {
      actualDir = "R";
    } else if (dir === "1") {
      actualDir = "D";
    } else if (dir === "2") {
      actualDir = "L";
    } else if (dir === "3") {
      actualDir = "U";
    } else {
      console.log("Error - unknown direction: ", dir);
    }
    instructions.push({
      dir: actualDir,
      num: parseInt(dist, 16),
    });
  }
  const points = convertToPoints(instructions);
  const perimeter = getPerimeter(instructions);
  // WHY IS IT HALF THE PERIMETER???? I DON'T UNDERSTANDDDD
  return shoeLaceArea(points) + perimeter / 2 + 1;
};

export default function useDay18() {
  return { part1, part2 };
}
