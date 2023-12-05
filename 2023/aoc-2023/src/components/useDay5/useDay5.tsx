import { useEffect, useState } from "react";
import { setupDayResults } from "../utils";
import { Result } from "../types";

type Mapping = {
  sourceStart: number;
  sourceEnd: number;
  destStart: number;
  destEnd: number;
  length: number;
};

export default function useDay5() {
  const findNext = (
    seed: number,
    mappingMaps: Map<string, Mapping[]>,
    mapName: string
  ): number => {
    const mapping = mappingMaps.get(mapName)!;
    for (let i = 0; i < mapping.length; i++) {
      if (seed >= mapping[i].sourceStart && seed <= mapping[i].sourceEnd) {
        const offset = seed - mapping[i].sourceStart;
        return mapping[i].destStart + offset;
      }
    }
    return seed;
  };

  const findLocation = (
    seed: number,
    mappingMaps: Map<string, Mapping[]>
  ): number => {
    let location = seed;
    location = findNext(location, mappingMaps, "seed-to-soil");
    location = findNext(location, mappingMaps, "soil-to-fertilizer");
    location = findNext(location, mappingMaps, "fertilizer-to-water");
    location = findNext(location, mappingMaps, "water-to-light");
    location = findNext(location, mappingMaps, "light-to-temperature");
    location = findNext(location, mappingMaps, "temperature-to-humidity");
    location = findNext(location, mappingMaps, "humidity-to-location");

    return location;
  };

  const part1 = (input: string[]): string | number => {
    const mappingMaps = new Map<string, Mapping[]>();

    let seeds: number[] = [];
    let currentMapping = "";
    for (let i = 0; i < input.length; i++) {
      if (input[i].startsWith("seeds:")) {
        // parse all the numbers after : in the string into a list of number seeds
        seeds = input[i]
          .split(" ")
          .slice(1)
          .map((num) => parseInt(num));
      }
      if (input[i] === "") {
        continue;
      }
      if (input[i].endsWith(":")) {
        currentMapping = input[i].split(" ")[0];
        mappingMaps.set(currentMapping, []);
        continue;
      }
      // Three numbers on the current line
      // [Destination range start, source range start, range length]
      // Parse the data into a list of objects with source start, source end, destination start, destination end, range length
      const numbers = input[i].split(" ").map((num) => parseInt(num));
      mappingMaps.get(currentMapping)?.push({
        sourceStart: numbers[1],
        sourceEnd: numbers[1] + numbers[2] - 1,
        destStart: numbers[0],
        destEnd: numbers[0] + numbers[2] - 1,
        length: numbers[2],
      });
    }

    // Sort the mapping maps from low to high based on sourceStart
    mappingMaps.forEach((value) => {
      value.sort((a, b) => a.sourceStart - b.sourceStart);
    });

    let closestSeed = Number.MAX_SAFE_INTEGER;
    seeds.forEach((seed) => {
      const location = findLocation(seed, mappingMaps);
      if (location < closestSeed) {
        closestSeed = location;
      }
      return location;
    });

    return closestSeed;
  };

  const getSource = (destination: number, mapping: Mapping[]): number => {
    for (let i = 0; i < mapping.length; i++) {
      if (
        destination >= mapping[i].destStart &&
        destination <= mapping[i].destEnd
      ) {
        const offset = destination - mapping[i].destStart;
        return mapping[i].sourceStart + offset;
      }
    }
    return destination;
  };

  const getClosestSeed = (
    mappingMaps: Map<string, Mapping[]>,
    seedMapping: Mapping[]
  ): number => {
    if (mappingMaps.get("humidity-to-location")![0].destStart > 0) {
      mappingMaps.get("humidity-to-location")!.unshift({
        sourceStart: 0,
        sourceEnd: mappingMaps.get("humidity-to-location")![0].destStart - 1,
        destStart: 0,
        destEnd: mappingMaps.get("humidity-to-location")![0].destStart - 1,
        length: mappingMaps.get("humidity-to-location")![0].destStart,
      });
    }
    for (let i = 0; i < mappingMaps.get("humidity-to-location")!.length; i++) {
      // Work backwards through all the maps, starting with the humidity-to-location map's destination range
      // to arrive at a seed.
      // Then check if the seed is in one of the ranges in the seedMapping.
      // if it us, return the location
      for (
        let location = mappingMaps.get("humidity-to-location")![i].destStart;
        location <= mappingMaps.get("humidity-to-location")![i].destEnd;
        location++
      ) {
        let findSeed = location;
        findSeed = getSource(
          findSeed,
          mappingMaps.get("humidity-to-location")!
        );
        findSeed = getSource(
          findSeed,
          mappingMaps.get("temperature-to-humidity")!
        );
        findSeed = getSource(
          findSeed,
          mappingMaps.get("light-to-temperature")!
        );
        findSeed = getSource(findSeed, mappingMaps.get("water-to-light")!);
        findSeed = getSource(findSeed, mappingMaps.get("fertilizer-to-water")!);
        findSeed = getSource(findSeed, mappingMaps.get("soil-to-fertilizer")!);
        findSeed = getSource(findSeed, mappingMaps.get("seed-to-soil")!);

        for (let j = 0; j < seedMapping.length; j++) {
          if (
            findSeed >= seedMapping[j].sourceStart &&
            findSeed <= seedMapping[j].sourceEnd
          ) {
            return location;
          }
        }
      }
    }

    return -1;
  };

  const part2 = (input: string[]): string | number => {
    const mappingMaps = new Map<string, Mapping[]>();

    let seeds: number[] = [];
    let currentMapping = "";
    for (let i = 0; i < input.length; i++) {
      if (input[i].startsWith("seeds:")) {
        // parse all the numbers after : in the string into a list of numbered seeds
        seeds = input[i]
          .split(" ")
          .slice(1)
          .map((num) => parseInt(num));
      }
      if (input[i] === "") {
        continue;
      }
      if (input[i].endsWith(":")) {
        currentMapping = input[i].split(" ")[0];
        mappingMaps.set(currentMapping, []);
        continue;
      }
      // Three numbers on the current line
      // [Destination range start, source range start, range length]
      // Parse the data into a list of objects with source start, source end, destination start, destination end, range length
      const numbers = input[i].split(" ").map((num) => parseInt(num));
      mappingMaps.get(currentMapping)?.push({
        sourceStart: numbers[1],
        sourceEnd: numbers[1] + numbers[2] - 1,
        destStart: numbers[0],
        destEnd: numbers[0] + numbers[2] - 1,
        length: numbers[2],
      });
    }

    // Sort the mapping maps from low to high based on destStart
    mappingMaps.forEach((value) => {
      value.sort((a, b) => a.destStart - b.destStart);
    });

    let seedMapping: Mapping[] = [];
    for (let s = 0; s < seeds.length; s += 2) {
      const range = seeds[s + 1];
      seedMapping.push({
        sourceStart: seeds[s],
        sourceEnd: seeds[s] + range - 1,
        destStart: seeds[s],
        destEnd: seeds[s] + range - 1,
        length: range,
      });
    }

    if (!mappingMaps.has("humidity-to-location")) {
      return -1;
    }

    return getClosestSeed(mappingMaps, seedMapping);
  };

  const ioPath = `${process.env.PUBLIC_URL}/io/useDay5`;

  const [resultsInput, setResultsInput] = useState<Result[]>([]);

  useEffect(() => {
    const getDayResults = async () => {
      setResultsInput(await setupDayResults(ioPath));
    };
    getDayResults();
  }, []);

  const newResults: Result[] = [];
  // run part 1 and part 2 for each entry in result and return the results
  resultsInput.forEach((result) => {
    // Time how long it takes to run part1 and part2
    console.log("Running part 1 for: ", result.name);
    let start = new Date();
    result.output1 = part1(result.input);
    result.duration1 = new Date().getTime() - start.getTime();
    console.log("Running part 2 for: ", result.name);
    start = new Date();
    result.output2 = part2(result.input);
    result.duration2 = new Date().getTime() - start.getTime();
    newResults.push(result);
    console.log(result);
  });

  return newResults;
}
