const part1 = (input: string[]): string | number => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    let first = -1;
    let last = -1;
    if (input[i] === "") {
      continue;
    }
    for (let j = 0; j < input[i].length; j++) {
      if (!Number.isNaN(parseInt(input[i][j]))) {
        const num = parseInt(input[i][j]);
        if (first === -1) {
          first = num;
        }
        last = num;
      }
    }
    sum += first * 10 + last;
  }
  return sum;
};

const spelledDigits = [
  { digit: 0, spelling: "zero" },
  { digit: 1, spelling: "one" },
  { digit: 2, spelling: "two" },
  { digit: 3, spelling: "three" },
  { digit: 4, spelling: "four" },
  { digit: 5, spelling: "five" },
  { digit: 6, spelling: "six" },
  { digit: 7, spelling: "seven" },
  { digit: 8, spelling: "eight" },
  { digit: 9, spelling: "nine" },
];

// Not 55064
const part2 = (input: string[]): string | number => {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "") {
      continue;
    }
    // Find the first and last place that each digit appears,
    // either as a number or a digit spelled out
    const first = { index: -1, digit: -1 };
    const last = { index: -1, digit: -1 };
    for (let j = 0; j < 10; j++) {
      let index = input[i].indexOf(j.toString());
      if (index !== -1) {
        if (index < first.index || first.index === -1) {
          first.index = index;
          first.digit = j;
        }
      }
      index = input[i].lastIndexOf(j.toString());
      if (index !== -1) {
        if (index > last.index || last.index === -1) {
          last.index = index;
          last.digit = j;
        }
      }
    }
    spelledDigits.forEach((spelledDigit) => {
      let index = input[i].indexOf(spelledDigit.spelling);
      if (index !== -1) {
        if (index < first.index || first.index === -1) {
          first.index = index;
          first.digit = spelledDigit.digit;
        }
      }
      index = input[i].lastIndexOf(spelledDigit.spelling);
      if (index !== -1) {
        if (index > last.index || last.index === -1) {
          last.index = index;
          last.digit = spelledDigit.digit;
        }
      }
    });
    sum += first.digit * 10 + last.digit;
  }
  return sum;
};

export default function useDay1() {
  return { part1, part2 };
}
