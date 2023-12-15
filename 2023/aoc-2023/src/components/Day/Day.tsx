import React, { useEffect, useState } from "react";
import { Result } from "../types";
import useGetInputs from "../useGetInputs/useGetInputs";

// props for Day, takes a useDay hook as a prop
interface DayProps {
  useDay: () => {
    part1: (input: string[]) => string | number;
    part2: (input: string[]) => string | number;
  };
}

enum ResultType {
  Mismatch = "Mismatch",
  Correct = "Correct",
  NoExpected = "NoExpected",
}

export default function Day({ useDay }: DayProps) {
  const ioPath = `${process.env.PUBLIC_URL}/io/${useDay.name}`;
  const { part1, part2 } = useDay();

  const resultsInput: Result[] = useGetInputs({ ioPath });

  const [results, setResults] = useState<Result[]>([]);

  const calculateResults = async (resultsInput: Result[]) => {
    const newResults: Result[] = [];
    // run part 1 and part 2 for each entry in result and return the results
    resultsInput.forEach((result) => {
      if (result.input.length < 1) {
        result.output1 = "Invalid input";
        result.output2 = "Invalid input";
        newResults.push(result);
        return;
      }
      console.log(`Running ${useDay.name} part 1 for: ${result.name}`);
      let start = new Date();
      result.output1 = part1(result.input);
      result.duration1 = new Date().getTime() - start.getTime();
      console.log(`Running ${useDay.name} part 2 for: ${result.name}`);
      start = new Date();
      result.output2 = part2(result.input);
      result.duration2 = new Date().getTime() - start.getTime();
      newResults.push(result);
    });

    setResults(newResults);
  };

  useEffect(() => {
    calculateResults(resultsInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsInput, part1, part2]);

  const compare = (output: string | number, expected: string | number) => {
    if (typeof output === "number" && typeof expected === "number") {
      return output === expected;
    } else {
      return output.toString() === expected.toString();
    }
  };

  const resultMarkup = (result: Result) => {
    const result1 = !result.expected1
      ? ResultType.NoExpected
      : compare(result.output1, result.expected1)
      ? ResultType.Correct
      : ResultType.Mismatch;
    const result2 = !result.expected2
      ? ResultType.NoExpected
      : compare(result.output2, result.expected2)
      ? ResultType.Correct
      : ResultType.Mismatch;
    return (
      <div>
        <div>
          <h3>Part 1</h3>
          <p className={result1}>Result: {result.output1}</p>
          <p className={result1}>Expect: {result.expected1}</p>
          <p>Time: {result.duration1}</p>
        </div>
        <div>
          <h3>Part 2</h3>
          <p className={result2}>Result: {result.output2}</p>
          <p className={result2}>Expect: {result.expected2}</p>
          <p>Time: {result.duration2}</p>
        </div>
      </div>
    );
  };

  // Return a horizontal list of results, with an entry for every result
  return (
    <div className="Day">
      {results.map((result) => (
        <div className="Day-results" key={result.name}>
          <h2>{result.name}</h2>
          <div>
            <textarea value={result.input.join("\n")} readOnly />
            {resultMarkup(result)}
          </div>
        </div>
      ))}
    </div>
  );
}
