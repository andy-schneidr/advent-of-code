enum State {
  UNPROCESSED = "unprocessed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
  state: State;
};

type Condition = {
  overRide?: string;
  vari?: "a" | "m" | "s" | "x";
  oper?: string;
  value?: number;
  result?: string;
};

const getWorkflows = (input: string[], workflows: Map<string, Condition[]>) => {
  for (let i = 0; i < input.length; i++) {
    if (input[i].length === 0) {
      continue;
    }
    if (!input[i].startsWith("{")) {
      const key = input[i].split("{")[0];
      const all = input[i].split("{")[1].split("}")[0].split(",");
      const conditions: Condition[] = [];
      for (let j = 0; j < all.length; j++) {
        if (all[j] === "A") {
          conditions.push({ overRide: "A" });
        } else if (all[j] === "R") {
          conditions.push({ overRide: "R" });
        } else if (all[j].includes(":")) {
          const result = all[j].split(":")[1];
          const check = all[j].split(":")[0];
          const vari = check[0];
          if (!(vari === "a" || vari === "m" || vari === "s" || vari === "x")) {
            console.log("invalid vari", vari);
            return;
          }
          const oper = check[1];
          const value = parseInt(check.substring(2));
          conditions.push({ vari, oper, value, result });
        } else {
          conditions.push({ overRide: all[j] });
        }
      }
      workflows.set(key, conditions);
    }
  }
};

const getParts = (input: string[], parts: Part[]) => {
  for (let i = 0; i < input.length; i++) {
    if (input[i].length === 0) {
      continue;
    }
    if (input[i].startsWith("{")) {
      const vars = input[i].split(",");
      const x = parseInt(vars[0].split("=")[1]);
      const m = parseInt(vars[1].split("=")[1]);
      const a = parseInt(vars[2].split("=")[1]);
      const s = parseInt(vars[3].split("=")[1]);
      parts.push({ x, m, a, s, state: State.UNPROCESSED });
    }
  }
};

const processParts = (parts: Part[], workflows: Map<string, Condition[]>) => {
  for (let i = 0; i < parts.length; i++) {
    let currentWorkflow = "in";
    while (parts[i].state === State.UNPROCESSED) {
      if (currentWorkflow === "A") {
        parts[i].state = State.ACCEPTED;
        break;
      }
      if (currentWorkflow === "R") {
        parts[i].state = State.REJECTED;
        break;
      }
      const conditions = workflows.get(currentWorkflow);
      if (!conditions) {
        console.log("no conditions found for workflow", currentWorkflow);
        return;
      }
      for (let c = 0; c < conditions.length; c++) {
        const condition = conditions[c];
        if (condition.overRide) {
          currentWorkflow = condition.overRide;
          break;
        }
        if (condition.vari && condition.oper && condition.value) {
          const toCompare = parts[i][condition.vari];
          if (condition.oper === "<" && toCompare < condition.value) {
            currentWorkflow = condition.result as string;
            break;
          }
          if (condition.oper === ">" && toCompare > condition.value) {
            currentWorkflow = condition.result as string;
            break;
          }
        } else {
          console.log("invalid condition", condition);
          return;
        }
      }
    }
  }
};

const part1 = (input: string[]): string | number => {
  const workflows = new Map<string, Condition[]>();

  getWorkflows(input, workflows);

  const parts: Part[] = [];

  getParts(input, parts);

  processParts(parts, workflows);

  let sum = 0;
  parts
    .filter((part) => part.state === State.ACCEPTED)
    .map((part) => (sum += part.x + part.m + part.a + part.s));

  return sum;
};

const copyRange = (range: Range): Range => {
  return {
    min: range.min,
    max: range.max,
  };
};

const copyXMASRange = (xmasRange: XMASRange): XMASRange => {
  return {
    a: copyRange(xmasRange.a),
    m: copyRange(xmasRange.m),
    s: copyRange(xmasRange.s),
    x: copyRange(xmasRange.x),
  };
};

type Range = {
  min: number;
  max: number;
};

type XMASRange = {
  a: Range;
  m: Range;
  s: Range;
  x: Range;
};

const exploreRanges = (
  workflows: Map<string, Condition[]>,
  currentWorkflow: string,
  xmasRange: XMASRange
): XMASRange[] => {
  if (currentWorkflow === "A") {
    return [xmasRange];
  }
  if (currentWorkflow === "R") {
    return [];
  }

  const successfulRanges: XMASRange[] = [];

  const conditions = workflows.get(currentWorkflow);
  if (!conditions) {
    console.log("no conditions found for workflow", currentWorkflow);
    return [];
  }
  for (let c = 0; c < conditions.length; c++) {
    const condition = conditions[c];
    if (condition.overRide) {
      // We're getting sent to some other workflow with the same ranges
      successfulRanges.push(
        ...exploreRanges(workflows, condition.overRide, xmasRange)
      );
      break;
    }
    if (condition.vari && condition.oper && condition.value) {
      const toCompare = xmasRange[condition.vari];
      if (condition.oper === "<") {
        // Adjust the max of the range to fit this constraint and explore
        const newRange: XMASRange = copyXMASRange(xmasRange);
        successfulRanges.push(
          ...exploreRanges(workflows, condition.result as string, {
            ...newRange,
            [condition.vari]: { min: toCompare.min, max: condition.value - 1 },
          })
        );

        // At the same time, adjust the min of the range to NOT fit this constraint and continue to explore
        xmasRange[condition.vari].min = condition.value;
      }
      if (condition.oper === ">") {
        // Adjust the min of the range to fit this constraint and explore
        const newRange: XMASRange = copyXMASRange(xmasRange);
        successfulRanges.push(
          ...exploreRanges(workflows, condition.result as string, {
            ...newRange,
            [condition.vari]: { min: condition.value + 1, max: toCompare.max },
          })
        );

        // At the same time, adjust the Max of the range to NOT fit this constraint and continue to explore
        xmasRange[condition.vari].max = condition.value;
      }
    } else {
      console.log("invalid condition", condition);
      return [];
    }
  }

  return successfulRanges;
};

const sumVolumes = (ranges: XMASRange[]): number => {
  let totalVolume = 0;
  for (let i = 0; i < ranges.length; i++) {
    totalVolume +=
      (ranges[i].x.max - ranges[i].x.min + 1) *
      (ranges[i].m.max - ranges[i].m.min + 1) *
      (ranges[i].a.max - ranges[i].a.min + 1) *
      (ranges[i].s.max - ranges[i].s.min + 1);
  }
  return totalVolume;
};

const part2 = (input: string[]): string | number => {
  const workflows = new Map<string, Condition[]>();

  getWorkflows(input, workflows);

  const xmasRange: XMASRange = {
    a: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
    x: { min: 1, max: 4000 },
  };

  const validRanges = exploreRanges(workflows, "in", xmasRange);
  // console.log(validRanges);

  return sumVolumes(validRanges);
};

export default function useDay19() {
  return { part1, part2 };
}
