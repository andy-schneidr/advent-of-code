type Position = {
  r: number;
  c: number;
};

const copyPos = (pos: Position): Position => {
  return {
    r: pos.r,
    c: pos.c,
  };
};

enum Pieces {
  Start,
  P_VERTICAL,
  P_HORIZONTAL,
  P_L,
  P_J,
  P_7,
  P_F,
  GND,
  NOT_ENCLOSED,
}

enum Direction {
  NN,
  NE,
  EE,
  SE,
  SS,
  SW,
  WW,
  NW,
}

const traverse = (
  input: string[],
  startPos: Position,
  posAfterStart: Position
): Position[] => {
  let currentPos = {
    r: posAfterStart.r,
    c: posAfterStart.c,
  };
  let previousPos = {
    r: startPos.r,
    c: startPos.c,
  };
  const allPositions: Position[] = [];
  allPositions.push(copyPos(startPos));
  while (currentPos.r !== startPos.r || currentPos.c !== startPos.c) {
    allPositions.push(copyPos(currentPos));
    // Find the next position to move to that isn't the previous position
    switch (input[currentPos.r][currentPos.c]) {
      case "|":
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        } else {
          // came from below, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case "-":
        if (previousPos.c === currentPos.c - 1) {
          // came from left, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        }
        break;
      case "L":
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case "J":
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        } else {
          // came from left, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case "7":
        if (previousPos.c === currentPos.c - 1) {
          // came from left, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        } else {
          // came from below, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        }
        break;
      case "F":
        if (previousPos.r === currentPos.r + 1) {
          // came from below, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        }
        break;
      default:
        console.log("ended up somewhere bad: ", currentPos);
        return [];
    }
  }
  return allPositions;
};

const touchOutside = (
  input: number[][],
  currentPos: Position,
  previousPos: Position,
  outsideDirection: Direction
): Direction => {
  // CORNER pieces will have an outside direction of NE/NW/SE/SW
  // VERTICAL pieces will have an outside direction of EE/WW
  // HORIZONTAL pieces will have an outside direction of NN/SS
  const cpR = currentPos.r;
  const cpC = currentPos.c;
  const currentPiece = input[currentPos.r][currentPos.c];
  const previousPiece = input[previousPos.r][previousPos.c];
  switch (previousPiece) {
    case Pieces.P_VERTICAL: // |
      switch (currentPiece) {
        case Pieces.P_L: // L
          if (outsideDirection === Direction.EE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            return Direction.NE;
          } else if (outsideDirection === Direction.WW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_J:
          if (outsideDirection === Direction.EE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else if (outsideDirection === Direction.WW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_F:
          if (outsideDirection === Direction.EE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            return Direction.SE;
          } else if (outsideDirection === Direction.WW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_7:
          if (outsideDirection === Direction.EE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NE;
          } else if (outsideDirection === Direction.WW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_VERTICAL:
          if (outsideDirection === Direction.EE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            return Direction.EE;
          } else if (outsideDirection === Direction.WW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            return Direction.WW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }
    case Pieces.P_HORIZONTAL: // -
      switch (currentPiece) {
        case Pieces.P_L: // L-
          if (outsideDirection === Direction.NN) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            return Direction.NE;
          } else if (outsideDirection === Direction.SS) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_J: // -J
          if (outsideDirection === Direction.NN) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            return Direction.NW;
          } else if (outsideDirection === Direction.SS) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_F: // F-
          if (outsideDirection === Direction.NN) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NW;
          } else if (outsideDirection === Direction.SS) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            return Direction.SE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_7: // -7
          if (outsideDirection === Direction.NN) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NE;
          } else if (outsideDirection === Direction.SS) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_HORIZONTAL: // --
          if (outsideDirection === Direction.NN) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NN;
          } else if (outsideDirection === Direction.SS) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SS;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }
    case Pieces.P_L:
      switch (currentPiece) {
        case Pieces.P_J: // LJ
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            return Direction.NW;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_F:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            return Direction.SE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_7: // L7 next
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_VERTICAL:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            return Direction.EE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            return Direction.WW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_HORIZONTAL: // L-
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NN;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SS;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }

    case Pieces.P_J:
      switch (currentPiece) {
        case Pieces.P_L: // LJ
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SW;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            return Direction.NE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_F: // FJ
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            return Direction.SE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_7:
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_VERTICAL:
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            return Direction.EE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            return Direction.WW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_HORIZONTAL: // -J
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SS;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NN;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }
    case Pieces.P_7:
      switch (currentPiece) {
        case Pieces.P_J:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_F:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.NW;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            return Direction.SE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_L:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            return Direction.NE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_VERTICAL:
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            return Direction.EE;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            return Direction.WW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_HORIZONTAL: // -7
          if (outsideDirection === Direction.NE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NN;
          } else if (outsideDirection === Direction.SW) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SS;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }
    case Pieces.P_F:
      switch (currentPiece) {
        case Pieces.P_L:
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            return Direction.NE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_J: // FJ
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC - 1 });
            return Direction.NW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_7: // F 7
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC - 1 });
            return Direction.SW;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 1 });
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NE;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_VERTICAL:
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC + 1 });
            return Direction.EE;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR + 0, c: cpC - 1 });
            return Direction.WW;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        case Pieces.P_HORIZONTAL: // F-
          if (outsideDirection === Direction.SE) {
            convertToNotEnclosed(input, { r: cpR + 1, c: cpC + 0 });
            return Direction.SS;
          } else if (outsideDirection === Direction.NW) {
            convertToNotEnclosed(input, { r: cpR - 1, c: cpC + 0 });
            return Direction.NN;
          } else {
            console.log("THIS SHOULD NEVER HAPPEN");
            return Direction.NN;
          }
        default:
          console.log("THIS SHOULD NEVER HAPPEN");
          return Direction.NN;
      }
    default:
      console.log("THIS SHOULD NEVER HAPPEN");
      return Direction.NN;
  }
};

const traverseOuterPipe = (input: number[][], startPos: Position): void => {
  // Figure out next direction
  let currentPos = {
    r: startPos.r,
    c: startPos.c,
  };
  let previousPos = {
    r: startPos.r,
    c: startPos.c,
  };
  let outsideDirection = Direction.NN;
  if (input[startPos.r][startPos.c] === Pieces.P_F) {
    outsideDirection = Direction.NW;
    currentPos.c++;
  } else if (input[startPos.r][startPos.c] === Pieces.P_HORIZONTAL) {
    outsideDirection = Direction.NN;
    currentPos.c++;
  } else if (input[startPos.r][startPos.c] === Pieces.P_7) {
    outsideDirection = Direction.NE;
    currentPos.r++;
  } else {
    console.log(
      "You've miscalculated something, start position is weird: ",
      startPos
    );
  }
  // The outside direction refers to that of the previousPos
  outsideDirection = touchOutside(
    input,
    currentPos,
    previousPos,
    outsideDirection
  );

  while (currentPos.r !== startPos.r || currentPos.c !== startPos.c) {
    // Find the next position to move to that isn't the previous position
    switch (input[currentPos.r][currentPos.c]) {
      case Pieces.P_VERTICAL: // |
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        } else {
          // came from below, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case Pieces.P_HORIZONTAL: // -
        if (previousPos.c === currentPos.c - 1) {
          // came from left, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        }
        break;
      case Pieces.P_L: // L
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case Pieces.P_J:
        if (previousPos.r === currentPos.r - 1) {
          // came from above, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        } else {
          // came from left, go up
          previousPos = copyPos(currentPos);
          currentPos.r--;
        }
        break;
      case Pieces.P_7:
        if (previousPos.c === currentPos.c - 1) {
          // came from left, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        } else {
          // came from below, go left
          previousPos = copyPos(currentPos);
          currentPos.c--;
        }
        break;
      case Pieces.P_F:
        if (previousPos.r === currentPos.r + 1) {
          // came from below, go right
          previousPos = copyPos(currentPos);
          currentPos.c++;
        } else {
          // came from right, go down
          previousPos = copyPos(currentPos);
          currentPos.r++;
        }
        break;
      default:
        console.log("ended up somewhere bad: ", currentPos);
        return;
    }
    outsideDirection = touchOutside(
      input,
      currentPos,
      previousPos,
      outsideDirection
    );
  }
  return;
};

const convertToNotEnclosed = (input: number[][], pos: Position): boolean => {
  const { r, c } = pos;
  if (r >= 0 && r < input.length && c >= 0 && c < input[r].length) {
    if (input[pos.r][pos.c] === Pieces.GND) {
      input[pos.r][pos.c] = Pieces.NOT_ENCLOSED;
      return true;
    }
  }
  return false;
};

const expandOuterSpace = (input: number[][]): void => {
  let found = true;
  let iterations = 0;
  while (found) {
    iterations++;
    found = false;
    for (let r = 0; r < input.length; r++) {
      for (let c = 0; c < input[r].length; c++) {
        if (input[r][c] === Pieces.NOT_ENCLOSED) {
          found = found || convertToNotEnclosed(input, { r: r + 1, c: c + 0 });
          found = found || convertToNotEnclosed(input, { r: r + 1, c: c - 1 });
          found = found || convertToNotEnclosed(input, { r: r + 1, c: c + 1 });
          found = found || convertToNotEnclosed(input, { r: r + 0, c: c + 1 });
          found = found || convertToNotEnclosed(input, { r: r + 0, c: c - 1 });
          found = found || convertToNotEnclosed(input, { r: r - 1, c: c + 0 });
          found = found || convertToNotEnclosed(input, { r: r - 1, c: c - 1 });
          found = found || convertToNotEnclosed(input, { r: r - 1, c: c + 1 });
        }
      }
    }
  }
  console.log("Iterations: ", iterations);
};

const part1 = (input: string[]): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }
  // find the starting position "S"
  let startPos: Position = {
    r: 0,
    c: 0,
  };
  for (let i = 0; i < input.length; i++) {
    if (input[i].includes("S")) {
      startPos.r = i;
      startPos.c = input[i].indexOf("S");
      break;
    }
  }

  // Find the two positions that can connect to the starting position
  let activePositions: Position[] = [];

  // Above - Can be a F, 7, or |
  if (
    startPos.r > 0 &&
    (input[startPos.r - 1][startPos.c] === "F" ||
      input[startPos.r - 1][startPos.c] === "7" ||
      input[startPos.r - 1][startPos.c] === "|")
  ) {
    activePositions.push({ r: startPos.r - 1, c: startPos.c });
  }
  // Right - Can be a 7, J, or -
  if (
    startPos.c < input[startPos.r].length - 1 &&
    (input[startPos.r][startPos.c + 1] === "J" ||
      input[startPos.r][startPos.c + 1] === "L" ||
      input[startPos.r][startPos.c + 1] === "-")
  ) {
    activePositions.push({ r: startPos.r, c: startPos.c + 1 });
  }
  // Below - Can be a J, L, or |
  if (
    startPos.r < input.length - 1 &&
    (input[startPos.r + 1][startPos.c] === "J" ||
      input[startPos.r + 1][startPos.c] === "L" ||
      input[startPos.r + 1][startPos.c] === "|")
  ) {
    activePositions.push({ r: startPos.r + 1, c: startPos.c });
  }
  // Left - Can be a L, F, or -
  if (
    startPos.c > 0 &&
    (input[startPos.r][startPos.c - 1] === "J" ||
      input[startPos.r][startPos.c - 1] === "L" ||
      input[startPos.r][startPos.c - 1] === "-")
  ) {
    activePositions.push({ r: startPos.r, c: startPos.c - 1 });
  }

  return traverse(input, startPos, activePositions[0]).length / 2;
};

const part2 = (input: string[]): string | number => {
  if (input.length < 2) {
    return "Invalid input";
  }
  // find the starting position "S"
  let startPos: Position = {
    r: 0,
    c: 0,
  };
  for (let i = 0; i < input.length; i++) {
    if (input[i].includes("S")) {
      startPos.r = i;
      startPos.c = input[i].indexOf("S");
      break;
    }
  }

  // Find the two positions that can connect to the starting position
  let activePositions: Position[] = [];
  let whatCanSBe = ["F", "7", "|", "J", "L", "-"];

  // Above - Can be a F, 7, or |
  if (
    startPos.r > 0 &&
    (input[startPos.r - 1][startPos.c] === "F" ||
      input[startPos.r - 1][startPos.c] === "7" ||
      input[startPos.r - 1][startPos.c] === "|")
  ) {
    whatCanSBe = whatCanSBe.filter(
      (char) => char === "|" || char === "J" || char === "L"
    );
    activePositions.push({ r: startPos.r - 1, c: startPos.c });
  }
  // Right - Can be a 7, J, or -
  if (
    startPos.c < input[startPos.r].length - 1 &&
    (input[startPos.r][startPos.c + 1] === "J" ||
      input[startPos.r][startPos.c + 1] === "L" ||
      input[startPos.r][startPos.c + 1] === "-")
  ) {
    whatCanSBe = whatCanSBe.filter(
      (char) => char === "-" || char === "F" || char === "L"
    );
    activePositions.push({ r: startPos.r, c: startPos.c + 1 });
  }
  // Below - Can be a J, L, or |
  if (
    startPos.r < input.length - 1 &&
    (input[startPos.r + 1][startPos.c] === "J" ||
      input[startPos.r + 1][startPos.c] === "L" ||
      input[startPos.r + 1][startPos.c] === "|")
  ) {
    whatCanSBe = whatCanSBe.filter(
      (char) => char === "|" || char === "F" || char === "7"
    );
    activePositions.push({ r: startPos.r + 1, c: startPos.c });
  }
  // Left - Can be a L, F, or -
  if (
    startPos.c > 0 &&
    (input[startPos.r][startPos.c - 1] === "F" ||
      input[startPos.r][startPos.c - 1] === "L" ||
      input[startPos.r][startPos.c - 1] === "-")
  ) {
    whatCanSBe = whatCanSBe.filter(
      (char) => char === "J" || char === "-" || char === "7"
    );
    activePositions.push({ r: startPos.r, c: startPos.c - 1 });
  }

  const partOfMainLoop = traverse(input, startPos, activePositions[0]);
  // const inputCopy: string[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++)
      if (!partOfMainLoop.find((pos) => pos.r === i && pos.c === j)) {
        input[i] = input[i].substring(0, j) + "." + input[i].substring(j + 1);
      }
  }

  input[startPos.r] =
    input[startPos.r].substring(0, startPos.c) +
    whatCanSBe[0] +
    input[startPos.r].substring(startPos.c + 1);

  const convertedInput: number[][] = [];
  for (let i = 0; i < input.length; i++) {
    let newRow: number[] = [];
    for (let j = 0; j < input[i].length; j++) {
      switch (input[i][j]) {
        case "S":
          newRow.push(Pieces.Start);
          break;
        case "|":
          newRow.push(Pieces.P_VERTICAL);
          break;
        case "-":
          newRow.push(Pieces.P_HORIZONTAL);
          break;
        case "L":
          newRow.push(Pieces.P_L);
          break;
        case "J":
          newRow.push(Pieces.P_J);
          break;
        case "7":
          newRow.push(Pieces.P_7);
          break;
        case "F":
          newRow.push(Pieces.P_F);
          break;
        case ".":
          newRow.push(Pieces.GND);
          break;
        default:
          console.log("THIS SHOULDN'T HAPPEN YET");
          newRow.push(Pieces.NOT_ENCLOSED);
          break;
      }
    }
    convertedInput.push(newRow);
  }

  // UHHHH OKAY YOU'RE A GUY... AND UH, YOU WALK UP TO THE PIPE, AND THEN
  let start = { r: 0, c: startPos.c };
  while (convertedInput[start.r][start.c] === Pieces.GND) {
    convertedInput[start.r][start.c] = Pieces.NOT_ENCLOSED;
    start.r++;
  }
  // YOU WALK KEEPING THE PIPE ON YOUR LEFT... AND ANYTIME THERE'S AN EMPTY SPACE ON YOUR RIGHT
  // THEN MARK IT AS THE OUTSIDE OF THE PIPE... AND THEN WHEN YOU GET BACK TO THE STARTING POSITION
  traverseOuterPipe(convertedInput, start);
  // THEN YOU'RE DONE AND YOU HAVE THE OUTSIDE OF THE PIPE...
  // AND THEN YOU EXPAND THE SPACE OUTSIDE THE PIPE UNTIL YOU CAN'T FIND ANY MORE FREE SPACE...
  expandOuterSpace(convertedInput);
  // AND THEN YOU COUNT THE SPACE THAT'S LEFT...

  let visualResult: string[] = [];
  for (let i = 0; i < convertedInput.length; i++) {
    let line = "";
    for (let j = 0; j < convertedInput[i].length; j++) {
      switch (convertedInput[i][j]) {
        case Pieces.GND:
          line += "▒";
          break;
        case Pieces.NOT_ENCLOSED:
          line += ".";
          break;
        case Pieces.Start:
          line += "S";
          break;
        case Pieces.P_HORIZONTAL:
          line += "―";
          break;
        case Pieces.P_VERTICAL:
          line += "|";
          break;
        case Pieces.P_L:
          line += "L";
          break;
        case Pieces.P_J:
          line += "J";
          break;
        case Pieces.P_7:
          line += "7";
          break;
        case Pieces.P_F:
          line += "F";
          break;
        default:
          line += convertedInput[i][j];
          break;
      }
    }
    visualResult.push(line);
  }
  console.log(visualResult);
  // return the number of entries in convertedInput that are Pieces.GND
  return convertedInput
    .map((row) => row.filter((piece) => piece === Pieces.GND).length)
    .reduce((a, b) => a + b, 0);

  // NOT 119
};

export default function useDay10() {
  return { part1, part2 };
}
