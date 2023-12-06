const waysToWin = (time: number, dist: number): number => {
  let startOfWinning = -1;
  let endOfWinning = -1;
  for (let i = 0; i <= time; i++) {
    // hold the button down for i seconds to get a speed of i
    // then let the boat travel at that speed for time - i seconds to get distance
    // if the distance is equal to the target distance, increment ways
    const distance = (time - i) * i;
    if (distance > dist) {
      startOfWinning = i;
      break;
    }
  }
  for (let i = time; i >= startOfWinning; i--) {
    const distance = (time - i) * i;
    if (distance > dist) {
      endOfWinning = i;
      break;
    }
  }
  const ways = endOfWinning - startOfWinning + 1;
  return ways;
};

const part1 = (input: string[]): string | number => {
  if (input.length !== 2) {
    return "Invalid input";
  }
  // parse all the numbers after : in the string into a list of number seeds
  const times = input[0]
    .split(" ")
    .slice(1)
    .map((num) => parseInt(num))
    .filter((num) => !isNaN(num));

  const dists = input[1]
    .split(" ")
    .slice(1)
    .map((num) => parseInt(num))
    .filter((num) => !isNaN(num));

  let waysPerDay = [];
  for (let i = 0; i < times.length; i++) {
    waysPerDay.push(waysToWin(times[i], dists[i]));
  }

  // return the product of the values in waysPerDay
  return waysPerDay.reduce((a, b) => a * b, 1);
};

const part2 = (input: string[]): string | number => {
  if (input.length !== 2) {
    return "Invalid input";
  }
  const times = input[0]
    .replaceAll(" ", "")
    .split(":")
    .slice(1)
    .map((num) => parseInt(num))
    .filter((num) => !isNaN(num));

  const dists = input[1]
    .replaceAll(" ", "")
    .split(":")
    .slice(1)
    .map((num) => parseInt(num))
    .filter((num) => !isNaN(num));

  // Not necessary at all but copied from part 1 haha
  let waysPerDay = [];
  for (let i = 0; i < times.length; i++) {
    waysPerDay.push(waysToWin(times[i], dists[i]));
  }

  // return the product of the values in waysPerDay
  return waysPerDay.reduce((a, b) => a * b, 1);
};

export default function useDay6() {
  return { part1, part2 };
}
