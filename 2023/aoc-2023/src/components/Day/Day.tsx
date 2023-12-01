import React from "react";
import { Result } from "../types";

// props for Day, takes a useDay hook as a prop
interface DayProps {
  useDay: () => Result[];
}

enum ResultType {
  Mismatch = "Mismatch",
  Correct = "Correct",
  NoExpected = "NoExpected",
}

export default function Day({ useDay }: DayProps) {
  const results = useDay();

  const compare = (output: string | number, expected: string | number) => {
    if (typeof output === "number" && typeof expected === "number") {
      return output === expected;
    } else {
      return output.toString() === expected.toString();
    }
  }

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
