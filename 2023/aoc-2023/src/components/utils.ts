import { Result } from "./types";

/**
 * @description Read and return the contents of a file
 * @param {string} path - Path to the file
 * @returns {string[]} - Contents of the file as an array of strings
 */
export const readFile = async (path: string): Promise<string[]> => {
  try {
    const data = await fetch(path).then((response) => response.text());
    return data.split("\n");
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * @description find all files in the directory ending with .in.txt.
 * return the contents of that file as an array of strings,
 * and the content of the corresponding .1.txt and .2.txt files as strings
 */
export const setupDayResults = async (directory: string): Promise<Result[]> => {
  const files = ["example", "input", "test"];
  const results: Result[] = await Promise.all(files.map(async (name): Promise<Result> => {
    const fullpathIn = `${directory}/${name}.in.txt`;
    const fullpath1 = `${directory}/${name}.1.txt`;
    const fullpath2 = `${directory}/${name}.2.txt`;

    let promise = await Promise.all([
      fetch(fullpathIn).then((response) => response.text()),
      fetch(fullpath1).then((response) => response.text()),
      fetch(fullpath2).then((response) => response.text()),
    ]);
    const input = promise[0].split("\n");
    const expected1 = promise[1].split("\n");
    const expected2 = promise[2].split("\n");

    return {
      name,
      input,
      output1: "",
      output2: "",
      expected1: expected1[0],
      expected2: expected2[0],
    };
  }));
  return results;
};
