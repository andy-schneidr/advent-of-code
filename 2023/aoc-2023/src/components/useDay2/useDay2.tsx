import { useEffect, useState } from "react";
import { setupDayResults } from "../utils";
import { Result } from "../types";

export default function useDay2() {
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
        console.log(element);
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
        console.log(element);
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
        console.log(element);
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
        console.log(element);
        const count = parseInt(element);
        if (count > largestBlue) {
          largestBlue = count;
        }
      });

      powersSum += largestRed * largestGreen * largestBlue;

    }

    return powersSum;
  };

  const ioPath = `${process.env.PUBLIC_URL}/io/useDay2`;

  const [resultsInput, setResultsInput] = useState<Result[]>([]);

  useEffect(() => {
    const getDayResults = async () => {
      setResultsInput(await setupDayResults(ioPath));
    };
    getDayResults();
  }, [ioPath]);

  const newResults: Result[] = [];
  // run part 1 and part 2 for each entry in result and return the results
  resultsInput.forEach((result) => {
    // Time how long it takes to run part1 and part2
    let start = new Date();
    result.output1 = part1(result.input);
    result.duration1 = new Date().getTime() - start.getTime();
    start = new Date();
    result.output2 = part2(result.input);
    result.duration2 = new Date().getTime() - start.getTime();
    newResults.push(result);
  });

  return newResults;
}
