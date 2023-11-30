import React from 'react';
import { Result } from '../types';


// props for Day, takes a useDay hook as a prop
interface DayProps {
    useDay: () => Result[];
}

export default function Day({useDay}: DayProps) {
    const results = useDay();

    // Return a horizontal list of results, with an entry for every result
    return (
        <div className="Day">
            {results.map((result) => (
                <div className="Day-results" key={result.name}>
                    <h2>{result.name}</h2>
                    <div>
                        <textarea value={result.input.join("\n")} readOnly />
                        <div>
                            <h3>Part 1</h3>
                            <p>Result: {result.output1}</p>
                            <p>Expect: {result.expected1}</p>
                            <p>Time: {result.duration1}</p>
                        </div>
                        <div>
                            <h3>Part 2</h3>
                            <p>Result: {result.output2}</p>
                            <p>Expect: {result.expected2}</p>
                            <p>Time: {result.duration2}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
  }
