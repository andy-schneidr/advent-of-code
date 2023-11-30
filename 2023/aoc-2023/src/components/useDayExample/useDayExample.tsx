import { useEffect, useState } from "react";
import { setupDayResults } from "../utils";
import { Result } from "../types";

export default function useDayExample() {
  const part1 = (input: string[]): string | number => {
    const elves = [];
    let elf = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '') {
        elves.push(elf);
        elf = 0;
      } else {
        elf += parseInt(input[i]);
      }
    }
    elves.push(elf);
    return elves.sort((a, b) => b - a)[0];
  };

  const part2 = (input: string[]): string | number => {
    let elves = [];
    let elf = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '') {
        elves.push(elf);
        elf = 0;
      } else {
        elf += parseInt(input[i]);
      }
    }
    elves.push(elf);
    elves = elves.sort((a, b) => b - a);
    return elves[0] + elves[1] + elves[2];
  };

  const ioPath = `${process.env.PUBLIC_URL}/io/useDayExample`;

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
