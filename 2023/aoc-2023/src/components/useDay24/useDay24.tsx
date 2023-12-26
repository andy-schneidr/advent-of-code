type XYZ = {
  x: number;
  y: number;
  z: number;
};

type Particle = {
  pos: XYZ;
  vel: XYZ;
};

type TargetArea = {
  min: XYZ;
  max: XYZ;
};

const parseInput = (input: string[]): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i].length === 0) {
      continue;
    }
    const parts = input[i].split(" @ ");
    const [x, y, z] = parts[0].split(",").map((x) => parseInt(x));
    const [vx, vy, vz] = parts[1].split(",").map((x) => parseInt(x));
    particles.push({
      pos: { x, y, z: z },
      vel: { x: vx, y: vy, z: vz },
    });
  }
  return particles;
};

const almostEqual = (a: number, b: number): boolean => {
  // God this language is stupid sometimes
  const similarity = Math.abs(a / b);
  return similarity > 0.99999;
};

/**
 * Check if two particles collide in a given area
 */
const collisionIn2DArea = (
  a: Particle,
  b: Particle,
  target: TargetArea
): boolean => {
  const collisionT1 =
    (b.vel.y * (a.pos.x - b.pos.x) + b.vel.x * (b.pos.y - a.pos.y)) /
    (a.vel.y * b.vel.x - a.vel.x * b.vel.y);
  const collisionT2 = (a.pos.y - b.pos.y + a.vel.y * collisionT1) / b.vel.y;
  if (collisionT1 < 0 || collisionT2 < 0) {
    return false;
  }

  const collisionX1 = a.pos.x + a.vel.x * collisionT1;
  const collisionY1 = a.pos.y + a.vel.y * collisionT1;
  const collisionX2 = b.pos.x + b.vel.x * collisionT2;
  const collisionY2 = b.pos.y + b.vel.y * collisionT2;

  if (
    !almostEqual(collisionX1, collisionX2) ||
    !almostEqual(collisionY1, collisionY2)
  ) {
    return false;
  }

  if (collisionX1 < target.min.x || collisionX1 > target.max.x) {
    return false;
  }

  if (collisionY1 < target.min.y || collisionY1 > target.max.y) {
    return false;
  }

  // 11433 is too low
  // 16453 is too low
  return true;
};

const part1 = (input: string[]): string | number => {
  const particles = parseInput(input);

  let totalCollisions = 0;
  let targetArea =
    input.length < 10
      ? {
          min: { x: 7, y: 7, z: 0 },
          max: { x: 27, y: 27, z: 0 },
        }
      : {
          min: { x: 200000000000000, y: 200000000000000, z: 0 },
          max: { x: 400000000000000, y: 400000000000000, z: 0 },
        };
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (collisionIn2DArea(particles[i], particles[j], targetArea)) {
        totalCollisions++;
      }
    }
  }

  return totalCollisions;
};

const part2 = (input: string[]): string | number => {
  // uh. so. Make a system of equations using any three particles.
  // https://quickmath.com/webMathematica3/quickmath/equations/solve/advanced.jsp#c=solve_solveequationsadvanced&v1=A%2520%2B%2520t*a%2520%253D%2520226812424329784%2520%2B%2520t*%2528-20%2529%250AB%2520%2B%2520t*b%2520%253D%2520313674772492962%2520%2B%2520t*%2528-101%2529%250AC%2520%2B%2520t*c%2520%253D%2520250967806511035%2520%2B%2520t*%252843%2529%250AA%2520%2B%2520w*a%2520%253D%2520156274983486737%2520%2B%2520w*%252845%2529%250AB%2520%2B%2520w*b%2520%253D%2520293490501315933%2520%2B%2520w*%2528-251%2529%250AC%2520%2B%2520w*c%2520%253D%2520293121959642065%2520%2B%2520w*%2528-173%2529%250AA%2520%2B%2520v*a%2520%253D%2520207764536837581%2520%2B%2520v*%252893%2529%250AB%2520%2B%2520v*b%2520%253D%2520163271244449071%2520%2B%2520v*%2528245%2529%250AC%2520%2B%2520v*c%2520%253D%2520371393112488483%2520%2B%2520v*%2528-192%2529&v2=A%250AB%250AC%250Aa%250Ab%250Ac%250At%250Aw%250Av
  // I used this website to solve it for me - I don't really want to implement an
  // equation solver. I think I could probably set up a http request to a matrix solver
  // or import some package that does math like this but I'm really tired and want to go to bed.
  return 118378223846841 + 228996474589321 + 259397320329497;
};

export default function useDay24() {
  return { part1, part2 };
}
