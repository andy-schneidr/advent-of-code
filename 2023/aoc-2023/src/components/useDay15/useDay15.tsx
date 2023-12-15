type lensEntry = {
  key: string;
  value: number;
};

const computeHash = (input: string): number => {
  let current = 0;
  for (let i = 0; i < input.length; i++) {
    const ascii = input.charCodeAt(i);
    current += ascii;
    current *= 17;
    current = current % 256;
  }
  return current;
};

const part1 = (input: string[]): string | number => {
  const sequence: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const values = input[i].split(",");
    for (let j = 0; j < values.length; j++) {
      sequence.push(values[j]);
    }
  }

  let sum = 0;

  for (let i = 0; i < sequence.length; i++) {
    sum += computeHash(sequence[i]);
  }
  return sum;
};

const part2 = (input: string[]): string | number => {
  const sequence: string[] = [];
  for (let i = 0; i < input.length; i++) {
    const values = input[i].split(",");
    for (let j = 0; j < values.length; j++) {
      sequence.push(values[j]);
    }
  }

  const lensMap: Map<number, lensEntry[]> = new Map();

  for (let i = 0; i < sequence.length; i++) {
    const equalsIndex = sequence[i].indexOf("=");
    const minusIndex = sequence[i].indexOf("-");

    const lensKey =
      equalsIndex > -1
        ? sequence[i].substring(0, equalsIndex)
        : sequence[i].substring(0, minusIndex);
    const boxIndex = computeHash(lensKey);
    const focal =
      equalsIndex > -1 ? parseInt(sequence[i].substring(equalsIndex + 1)) : -1;

    // If =: add to map, replacing if already exists
    // If -: find in map if it exists, remove from array
    if (!lensMap.has(boxIndex)) {
      lensMap.set(boxIndex, []);
    }
    if (equalsIndex > -1) {
      const entries = lensMap.get(boxIndex);
      if (entries) {
        let found = false;
        for (let j = 0; j < entries.length; j++) {
          if (entries[j].key === lensKey) {
            entries[j].value = focal;
            found = true;
            break;
          }
        }
        if (!found) {
          entries.push({ key: lensKey, value: focal });
        }
      } else {
        console.log("entries are undefined for existing box index?????");
      }
    }
    if (minusIndex > -1) {
      const entries = lensMap.get(boxIndex);
      if (entries) {
        for (let j = 0; j < entries.length; j++) {
          if (entries[j].key === lensKey) {
            entries.splice(j, 1);
            break;
          }
        }
      } else {
        console.log("entries are undefined for existing box index?????");
      }
    }
  }

  let power = 0;
  // iterate over all the entries in the map
  for (const [key, value] of lensMap) {
    let allLensesPower = 0;
    for (let i = 0; i < value.length; i++) {
      allLensesPower += (1 + key) * (i + 1) * value[i].value;
    }
    power += allLensesPower;
  }

  return power;
};

export default function useDay15() {
  return { part1, part2 };
}
