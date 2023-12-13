const findHorizontal = (
  pattern: string[],
  useSmudge: boolean
): number | null => {
  for (let i = 0; i < pattern.length - 1; i++) {
    let linesToMatch = Math.min(i + 1, pattern.length - i - 1);
    let lower = i + 1;
    let upper = i;
    let count = 0;
    let errors = 0;
    while (count < linesToMatch) {
      for (let j = 0; j < pattern[lower].length; j++) {
        if (pattern[lower][j] !== pattern[upper][j]) {
          errors++;
          if (errors > 1) {
            break;
          }
        }
      }
      if (errors > 1) {
        break;
      }
      count++;
      lower++;
      upper--;
    }
    if (useSmudge && errors === 1) {
      return i + 1;
    } else if (!useSmudge && errors === 0) {
      return i + 1;
    }
  }
  return null;
};

const matchingColumn = (
  pattern: string[],
  colA: number,
  colB: number
): number => {
  let errors = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i][colA] !== pattern[i][colB]) {
      errors++;
      // the condition below is pretty specific to this problem, eeeugh
      if (errors > 1) {
        break;
      }
    }
  }
  return errors;
};

const findVertical = (pattern: string[], useSmudge: boolean): number | null => {
  // Ohhhh my god why do I like imperative programming so much why can't i just
  // be normal and use map and filter and reduce and all that stuff lmaooooo
  for (let c = 0; c < pattern[0].length - 1; c++) {
    let linesToMatch = Math.min(c + 1, pattern[0].length - c - 1);
    let r = c + 1;
    let l = c;
    let count = 0;
    let errors = 0;
    while (count < linesToMatch) {
      errors += matchingColumn(pattern, r, l);
      count++;
      r++;
      l--;
      if (errors > 1) {
        break;
      }
    }
    if (errors > 1) {
      continue;
    }
    if (useSmudge && errors === 1) {
      return c + 1;
    } else if (!useSmudge && errors === 0) {
      return c + 1;
    }
  }
  return null;
};

const computeReflections = (
  input: string[],
  useSmudge: boolean = false
): number => {
  const patterns: string[][] = [];
  patterns.push([]);
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      patterns.push([]);
    } else {
      patterns[patterns.length - 1].push(input[i]);
    }
  }

  let sum = 0;
  for (let i = 0; i < patterns.length; i++) {
    const horizontal = findHorizontal(patterns[i], useSmudge);
    if (horizontal !== null) {
      sum += horizontal * 100;
      continue;
    }
    const vertical = findVertical(patterns[i], useSmudge);
    if (vertical !== null) {
      sum += vertical * 1;
      continue;
    }
    console.log("Error - Could not find line of reflection for pattern: ", i);
  }
  return sum;
};

const part1 = (input: string[]): string | number => {
  return computeReflections(input, false);
};

const part2 = (input: string[]): string | number => {
  return computeReflections(input, true);
};

export default function useDay13() {
  return { part1, part2 };
}
