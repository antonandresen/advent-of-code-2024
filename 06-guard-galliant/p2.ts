import { readFileSync } from 'fs';

const mapInput = readFileSync('./06-guard-galliant/p2.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const numRows = mapInput.length;
const numCols = mapInput[0].length;

const directionSymbols = ['^', '>', 'v', '<'];
const dx = [0, 1, 0, -1];
const dy = [-1, 0, 1, 0];

let guardStartX = 0;
let guardStartY = 0;
let guardStartDirectionIndex = 0;

outerLoop:
for (let y = 0; y < numRows; y++) {
  for (let x = 0; x < numCols; x++) {
    const cell = mapInput[y][x];
    const dirIndex = directionSymbols.indexOf(cell);

    // Guard found
    if (dirIndex !== -1) {
      guardStartX = x;
      guardStartY = y;
      guardStartDirectionIndex = dirIndex;
      break outerLoop;
    }
  }
}

// Check if guard gets stuck with obstruction at (x, y)
function doesGuardGetStuck(obstructionX: number, obstructionY: number): boolean {
  // Guard start position
  if (obstructionX === guardStartX && obstructionY === guardStartY) {
    return false;
  }

  // Already an obstacle
  if (mapInput[obstructionY][obstructionX] === '#') {
    return false;
  }

  mapInput[obstructionY][obstructionX] = '#';

  // Init
  let guardX = guardStartX;
  let guardY = guardStartY;
  let directionIndex = guardStartDirectionIndex;

  // State for checking if guard is stuck
  const stateHistory = new Set<string>();

  // Move guard
  while (true) {
    const stateID = `${guardX},${guardY},${directionIndex}`;

    // Back to same position, guard is stuck
    if (stateHistory.has(stateID)) {
      mapInput[obstructionY][obstructionX] = '.';
      return true;
    }

    stateHistory.add(stateID);

    const nextX = guardX + dx[directionIndex];
    const nextY = guardY + dy[directionIndex];

    const withinBounds = nextX >= 0 && nextX < numCols && nextY >= 0 && nextY < numRows;

    // About to move out of bounds
    if (!withinBounds) {
      break;
    }

    if (mapInput[nextY][nextX] === '#') {
      // Turn 90 deg
      directionIndex = (directionIndex + 1) % 4;
    } else {
      // Move
      guardX = nextX;
      guardY = nextY;
    }
  }

  // Reset obstacle
  mapInput[obstructionY][obstructionX] = '.';

  return false;
}

let obstructionCount = 0;

// Brute force
for (let y = 0; y < numRows; y++) {
  for (let x = 0; x < numCols; x++) {

    if (doesGuardGetStuck(x, y)) {
      obstructionCount++;
    }
  }
}

console.log(`Number of possible obstruction positions: ${obstructionCount}`);

