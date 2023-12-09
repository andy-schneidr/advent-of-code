type Node = {
  left: string;
  right: string;
};

const part1 = (input: string[]): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }

  const instructions = input[0];
  let currentNode = "AAA";

  const nodes: Map<string, Node> = new Map();
  for (let i = 2; i < input.length; i++) {
    // NO TIME TO PARSE GOOD JUST PARSE STUPID
    const n = input[i].substring(0, 3);
    const l = input[i].substring(7, 10);
    const r = input[i].substring(12, 15);
    // set the node n in the nodes map
    if (nodes.has(n)) {
      console.log("Duplicate node found: ", n);
    }
    nodes.set(n, { left: l, right: r });
  }
  console.log(nodes);

  // find the node zzz
  let instructionIndex = 0;
  let steps = 0;
  while (currentNode !== "ZZZ") {
    if (instructions[instructionIndex] === "R") {
      currentNode = nodes.get(currentNode)!.right;
    } else {
      currentNode = nodes.get(currentNode)!.left;
    }
    steps++;
    instructionIndex++;
    if (instructionIndex >= instructions.length) {
      instructionIndex = 0;
    }
  }

  return steps;
};

const allNodesEndWithZ = (nodes: string[]): boolean => {
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].endsWith("Z")) {
      return false;
    }
  }
  return true;
};

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

const part2 = (input: string[]): string | number => {
  // return "Invalid input";
  if (input.length < 2) {
    return "Invalid input";
  }

  const instructions = input[0];

  let workingNodes: string[] = [];
  let stepsToZ: number[] = [];

  const nodes: Map<string, Node> = new Map();
  for (let i = 2; i < input.length; i++) {
    const n = input[i].substring(0, 3);
    const l = input[i].substring(7, 10);
    const r = input[i].substring(12, 15);
    // set the node n in the nodes map
    if (nodes.has(n)) {
      console.log("Duplicate node found: ", n);
    }
    if (n.endsWith("A")) {
      workingNodes.push(n);
    }
    nodes.set(n, { left: l, right: r });
  }
  console.log(nodes);

  // find the node zzzz
  let instructionIndex = 0;
  let steps = 0;
  while (!allNodesEndWithZ(workingNodes)) {
    if (instructions[instructionIndex] === "R") {
      for (let i = 0; i < workingNodes.length; i++) {
        workingNodes[i] = nodes.get(workingNodes[i])!.right;
      }
    } else {
      for (let i = 0; i < workingNodes.length; i++) {
        workingNodes[i] = nodes.get(workingNodes[i])!.left;
      }
    }
    steps++;
    instructionIndex++;
    for (let i = 0; i < workingNodes.length; i++) {
      if (workingNodes[i].endsWith("Z")) {
        stepsToZ.push(steps);
        workingNodes.splice(i, 1);
      }
    }
    if (instructionIndex >= instructions.length) {
      instructionIndex = 0;
    }
  }

  // this is so inefficient hahaha I just want to go to bed lmao
  const stepsToZSet = new Set<number>(stepsToZ);
  const stepsToZArray = Array.from(stepsToZSet);
  return stepsToZArray.reduce(lcm);
};

export default function useDay8() {
  return { part1, part2 };
}
