import { useCallback, useLayoutEffect, useState } from "react";
import { Result } from "../types";
import { setupDayResults } from "../utils";

export default function useGetInputs({ ioPath }: { ioPath: string }) {
  const [resultsInput, setResultsInput] = useState<Result[]>([]);

  const getResultsInput = useCallback(async () => {
    setResultsInput(await setupDayResults(ioPath));
  }, [ioPath]);

  useLayoutEffect(() => {
    getResultsInput();
  }, [getResultsInput]);

  return resultsInput;
}
