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

    const input = await readFile(fullpathIn);
    const expected1 = await readFile(fullpath1);
    const expected2 = await readFile(fullpath2);

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
