import { useCallback, useLayoutEffect, useState } from "react";
import { DayProps, Result } from "../types";
import { setupDayResults } from "../utils";

export default function useGetInputs({
  useDay,
  ioPath,
}: {
  useDay: DayProps["useDay"];
  ioPath: string;
}) {
  const { part1, part2 } = useDay();
  const [resultsInput, setResultsInput] = useState<{
    part1: (input: string[]) => string | number;
    part2: (input: string[]) => string | number;
    resultsInput: Result[];
  }>({
    part1,
    part2,
    resultsInput: [],
  });

  const getResultsInput = useCallback(async () => {
    let input = await setupDayResults(ioPath);
    setResultsInput({
      part1,
      part2,
      resultsInput: input,
    });
  }, [ioPath, part1, part2]);

  useLayoutEffect(() => {
    getResultsInput();
  }, [getResultsInput]);

  return {
    part1: resultsInput.part1,
    part2: resultsInput.part2,
    resultsInput: resultsInput.resultsInput,
  };
}
