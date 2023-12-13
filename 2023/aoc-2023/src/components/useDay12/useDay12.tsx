const placeGroups = (
  springs: number[],
  groups: number[],
  groupIndex: number,
  idx: number,
  memo: Map<string, number>
): number => {
  const key = `${groupIndex}-${idx}`;
  if (memo.has(key)) {
    // console.log("memo hit");
    return memo.get(key)!;
  }
  if (groupIndex === groups.length) {
    // all groups placed
    if (springs.slice(idx).includes(1)) {
      // not viable - still broken springs
      memo.set(key, 0);
      return 0;
    }
    memo.set(key, 1);
    return 1;
  }
  if (
    groups[groupIndex] > springs.length - idx ||
    groups.length - groupIndex > springs.length - idx
  ) {
    // not viable - not enough room
    memo.set(key, 0);
    return 0;
  }
  let ways = 0;

  // keep trying to find the next place you could put the current group.
  const currentGroupLength = groups[groupIndex];
  for (let i = idx; i <= springs.length - currentGroupLength; i++) {
    if (springs[i] === 0) {
      // still not in a group
      continue;
    }
    if (springs[i - 1] === 1) {
      // Can't put a group here, still part of the last group
      continue;
    }

    // Could I put this group RIGHT HERE?
    // is there a mix of currentGroupLength consecutive 1s and 2s with a 0 or a 2 at the end?
    let viable = true;
    if (
      i + currentGroupLength === springs.length ||
      springs[i + currentGroupLength] === 2 ||
      springs[i + currentGroupLength] === 0
    ) {
      for (let j = i + 1; j < i + currentGroupLength; j++) {
        if (springs[j] === 0) {
          viable = false;
          break;
        }
      }
      if (viable) {
        // Put this group of broken springs RIGHT HERE
        // Advance to the next group and the next index
        // after this group
        ways += placeGroups(
          springs,
          groups,
          groupIndex + 1,
          i + currentGroupLength + 1,
          memo
        );
      }
    }

    // If we encounter a 1 we must make sure that it's used in the current group
    if (springs[i] === 1) {
      break;
    }
  }
  memo.set(key, ways);
  return ways;
};

const compute = (input: string[], duplications: number): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }
  let totalValid = 0;
  for (let i = 0; i < input.length; i++) {
    const springs = input[i].split(" ")[0];

    // convert springs to 1s and 0s
    const springsNumsOG: number[] = [];
    for (let j = 0; j < springs.length; j++) {
      if (springs[j] === ".") {
        springsNumsOG.push(0);
      } else if (springs[j] === "#") {
        springsNumsOG.push(1);
      } else if (springs[j] === "?") {
        springsNumsOG.push(2);
      }
    }

    // copy springNums n times with 2's in between
    const springsNums: number[] = [];
    for (let j = 0; j < duplications; j++) {
      springsNums.push(...springsNumsOG);
      if (j !== duplications - 1) {
        springsNums.push(2);
      }
    }

    const groupsOG = input[i]
      .split(" ")[1]
      .split(",")
      .map((num) => parseInt(num));

    // copy the groups n times;
    const groups: number[] = [];
    for (let j = 0; j < duplications; j++) {
      groups.push(...groupsOG);
    }
    const validCount = placeGroups(springsNums, groups, 0, 0, new Map());
    totalValid += validCount;
  }
  return totalValid;
};

const part1 = (input: string[]): string | number => {
  return compute(input, 1);
};

const part2 = (input: string[]): string | number => {
  return compute(input, 5);
};

export default function useDay12() {
  return { part1, part2 };
}
