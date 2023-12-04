import { useEffect, useState } from "react";
import { setupDayResults } from "../utils";
import { Result } from "../types";

export default function useDay4() {
  const part1 = (input: string[]): string | number => {

    let points = 0;
    for(let i = 0; i < input.length; i++) {
      if (input[i] === "") {
        continue;
      }
      let line = input[i].split(":")[1];
      if (line === undefined) {
        continue;
      }
      line = line.trim();
      const winners = line.split("|")[0].trim().split(" ").map((winner) => winner.trim()).filter((winner) => winner !== "");
      const numbers = line.split("|")[1].trim().split(" ").map((number) => number.trim()).filter((number) => number !== "");

      let count = 0;
      for(let j = 0; j < numbers.length; j++) {
        if(winners.includes(numbers[j])) {
          count++;
        }
      }
      if (count === 0) {
        continue;
      }
      let score = 1;
      count--;
      while(count > 0) {
        score *= 2;
        count--;
      }
      points += score;
    }
    return points;
  };

  const part2 = (input: string[]): string | number => {

    // Map of card number (line number) to the list of card number indexes that it provides
    const cardMap: {[key: number]: number[]} = {};

    // Go through the cards once to find out the cards that they provide
    for(let i = 0; i < input.length; i++) {
      if (input[i] === "") {
        continue;
      }
      let line = input[i].split(":")[1];
      if (line === undefined) {
        continue;
      }
      line = line.trim();
      const winners = line.split("|")[0].trim().split(" ").map((winner) => winner.trim()).filter((winner) => winner !== "");
      const numbers = line.split("|")[1].trim().split(" ").map((number) => number.trim()).filter((number) => number !== "");

      let count = 0;
      for(let j = 0; j < numbers.length; j++) {
        if(winners.includes(numbers[j])) {
          count++;
        }
      }
      cardMap[i] = [];
      for(let j = 1; j <= count; j++) {
        cardMap[i].push(i + j);
      }
    }

    // OKay, we have one of each card
    // Create a list of one for each line in the input
    let cards: number[] = [];
    for(let i = 0; i < input.length; i++) {
      cards.push(1);
    }
    for(let i = 0; i < cards.length; i++) {
      if (cardMap[i] === undefined) {
        console.error("missing a map for card: ", i);
        continue;
      }
      cardMap[i].forEach(wonCardIndex => {
        cards[wonCardIndex] += cards[i];
      });
    }

    const totalCards = cards.reduce((a, b) => a + b, 0);
    return totalCards;
  };

  const ioPath = `${process.env.PUBLIC_URL}/io/useDay4`;

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
