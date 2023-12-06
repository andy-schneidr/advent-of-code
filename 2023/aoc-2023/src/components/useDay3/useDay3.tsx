const symbols = ["*", "+", "-", "/", "%", "@", "&", "#", "=", "$"];

// Check if any of the characters arount the character at row, col are symbols
const checkForSymbol = (row: number, col: number, input: string[]) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow < 0 || newRow > input.length - 1) {
        continue;
      }
      if (newCol < 0 || newCol > input[newRow].length - 1) {
        continue;
      }
      const char = input[newRow][newCol];
      if (char && symbols.includes(char)) {
        // console.log("Found a symbol", char, "at", row + i, col + j);
        return true;
      }
    }
  }
  return false;
};

const part1 = (input: string[]): string | number => {
  // Go through all the characters in the input.
  // Go until you find a number. When you do start a new number.

  // For each number, check if it's adjacent to a symbol.
  // (*, X, +, -, /, %, ^, !, =, <, >, &, |, ~, ?)
  // If it is, add it to the list of numbers.
  //
  const partNumbers: number[] = [];

  for (let row = 0; row < input.length; row++) {
    let currentNumber: number | null = null;
    let currentNumberIsAPart: boolean = false;
    for (let col = 0; col < input[row].length; col++) {
      const char = input[row][col];
      const num = parseInt(char);
      const isNumber = !isNaN(num);

      if (currentNumber === null) {
        if (isNumber) {
          currentNumber = parseInt(char);
        }
      } else if (currentNumber !== null && isNumber) {
        currentNumber = currentNumber * 10 + parseInt(char);
      }

      if (
        currentNumber !== null &&
        currentNumberIsAPart === false &&
        isNumber
      ) {
        currentNumberIsAPart = checkForSymbol(row, col, input);
      }

      // Are we at the end of the number or the line?
      if (col === input[row].length - 1 || !isNumber) {
        if (currentNumber !== null && currentNumberIsAPart) {
          partNumbers.push(currentNumber);
        }
        currentNumber = null;
        currentNumberIsAPart = false;
      }
    }
  }

  let sum = 0;
  for (let num of partNumbers) {
    sum += num;
  }
  return sum;
};

type gear = {
  number1: number;
  number2: number;
  gearLocation: {
    row: number;
    col: number;
  };
};

const checkForGear = (
  row: number,
  col: number,
  input: string[]
): { row: number; col: number } | null => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow < 0 || newRow > input.length - 1) {
        continue;
      }
      if (newCol < 0 || newCol > input[newRow].length - 1) {
        continue;
      }
      const char = input[newRow][newCol];
      if (char === "*") {
        return { row: newRow, col: newCol };
      }
    }
  }
  return null;
};

const part2 = (input: string[]): string | number => {
  let gears: gear[] = [];

  for (let row = 0; row < input.length; row++) {
    let currentNumber: number | null = null;
    let currentNumberIsAGear: boolean = false;
    let existingGearIndex: number | null = null;
    for (let col = 0; col < input[row].length; col++) {
      const char = input[row][col];
      const num = parseInt(char);
      const isNumber = !isNaN(num);

      if (currentNumber === null) {
        if (isNumber) {
          currentNumber = parseInt(char);
        }
      } else if (currentNumber !== null && isNumber) {
        // The current thing is a number and there's a number going
        // console.log("currentNumber", currentNumber);
        currentNumber = currentNumber * 10 + parseInt(char);
      }

      if (
        currentNumber !== null &&
        currentNumberIsAGear === false &&
        isNumber
      ) {
        let gear = checkForGear(row, col, input);
        if (gear !== null) {
          currentNumberIsAGear = true;
          // Check if gears contains a gear with the same location
          let found = false;
          for (let i = 0; i < gears.length; i++) {
            if (
              gears[i].gearLocation.row === gear.row &&
              gears[i].gearLocation.col === gear.col
            ) {
              existingGearIndex = i;
              found = true;
              break;
            }
          }
          if (!found) {
            gears.push({
              number1: currentNumber,
              number2: 0,
              gearLocation: gear,
            });
          }
        }
      }

      // Are we at the end of the number or the line?
      if (col === input[row].length - 1 || !isNumber) {
        if (currentNumber !== null && currentNumberIsAGear) {
          if (existingGearIndex !== null) {
            // update this number as number 2
            gears[existingGearIndex].number2 = currentNumber;
          } else {
            // We found a gear, but it's new.
            gears[gears.length - 1].number1 = currentNumber;
          }
        }
        currentNumber = null;
        currentNumberIsAGear = false;
        existingGearIndex = null;
      }
    }
  }

  let sum = 0;
  for (let gear of gears) {
    sum += gear.number1 * gear.number2; // Add each number to the total sum
  }
  return sum;
};

export default function useDay3() {
  return { part1, part2 };
}
