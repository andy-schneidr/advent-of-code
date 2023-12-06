const part1 = (input: string[]): string | number => {
  let indexesSum = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    const regexpRed = /\d+(?= red)/g;
    const regexpGreen = /\d+(?= green)/g;
    const regexpBlue = /\d+(?= blue)/g;

    let valid = true;

    input[i].match(regexpRed)?.forEach((element) => {
      const count = parseInt(element);
      if (count > 12) {
        valid = false;
      }
    });

    input[i].match(regexpGreen)?.forEach((element) => {
      const count = parseInt(element);
      if (count > 13) {
        valid = false;
      }
    });

    input[i].match(regexpBlue)?.forEach((element) => {
      const count = parseInt(element);
      if (count > 14) {
        valid = false;
      }
    });

    if (valid) {
      indexesSum += i + 1;
    }
  }

  return indexesSum;
};

const part2 = (input: string[]): string | number => {
  let powersSum = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    const regexpRed = /\d+(?= red)/g;
    const regexpGreen = /\d+(?= green)/g;
    const regexpBlue = /\d+(?= blue)/g;

    let largestRed = 0;
    let largestGreen = 0;
    let largestBlue = 0;

    input[i].match(regexpRed)?.forEach((element) => {
      const count = parseInt(element);
      if (count > largestRed) {
        largestRed = count;
      }
    });

    input[i].match(regexpGreen)?.forEach((element) => {
      const count = parseInt(element);
      if (count > largestGreen) {
        largestGreen = count;
      }
    });

    input[i].match(regexpBlue)?.forEach((element) => {
      const count = parseInt(element);
      if (count > largestBlue) {
        largestBlue = count;
      }
    });

    powersSum += largestRed * largestGreen * largestBlue;
  }

  return powersSum;
};
export default function useDay2() {
  return { part1, part2 };
}
