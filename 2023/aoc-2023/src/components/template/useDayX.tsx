import { useEffect, useState } from "react";
import { setupDayResults } from "../utils";
import { Result } from "../types";

export default function useDayX() {
  const part1 = (input: string[]): string | number => {
    console.log("not implemented")
    return "not implemented";
  };

  const part2 = (input: string[]): string | number => {
    console.log("not implemented")
    return "not implemented";
  };

  const ioPath = `${process.env.PUBLIC_URL}/io/useDayX`;

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
