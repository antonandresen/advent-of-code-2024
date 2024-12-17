import { readFileSync } from 'fs';

const map = readFileSync('./10-hoof-it/p2.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split('').map(Number));

const numRows = map.length;
const numCols = map[0].length;

type Position = {
  row: number;
  col: number;
};

// Find all trailheads (positions with height 0)
const trailheads: Position[] = [];
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    if (map[row][col] === 0) {
      trailheads.push({ row, col });
    }
  }
}

function getValidNeighbors(pos: Position, currentHeight: number): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    const newRow = pos.row + dir.row;
    const newCol = pos.col + dir.col;

    // Check bounds
    if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) {
      continue;
    }

    // Check if height increases by exactly 1
    if (map[newRow][newCol] === currentHeight + 1) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

function countDistinctPaths(start: Position): number {
  // dp[row][col] represents number of paths to this position
  let dp: number[][] = Array(numRows).fill(null).map(() =>
    Array(numCols).fill(0)
  );

  // Initialize starting point
  dp[start.row][start.col] = 1;

  // Process each position in order of height
  for (let height = 0; height < 9; height++) {
    const newDp = Array(numRows).fill(null).map(() => Array(numCols).fill(0));
    
    // Look for positions with current height that have paths to them
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (map[row][col] === height && dp[row][col] > 0) {
          // Get valid neighbors (positions with height + 1)
          const neighbors = getValidNeighbors({ row, col }, height);
          
          // Add paths to neighbors
          for (const neighbor of neighbors) {
            newDp[neighbor.row][neighbor.col] += dp[row][col];
          }
        }
      }
    }
    dp = newDp;
  }

  // Sum up all paths that reach height 9 positions
  let totalPaths = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (map[row][col] === 9) {
        totalPaths += dp[row][col];
      }
    }
  }

  return totalPaths;
}

let totalRating = 0;

// Process each trailhead
for (const trailhead of trailheads) {
  const rating = countDistinctPaths(trailhead);
  totalRating += rating;
}

console.log(`Sum of trailhead ratings: ${totalRating}`);