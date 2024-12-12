import { readFileSync } from 'fs';
import { gcd } from '../utils';

const mapInput = readFileSync('./08-resonant-collinearity/p1.input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => line.split(''));

const numRows = mapInput.length;
const numCols = mapInput[0].length;

type Position = { x: number; y: number };
type Antenna = { position: Position; frequency: string };

const antennas: Antenna[] = [];

// Find antennas on map
for (let y = 0; y < numRows; y++) {
  for (let x = 0; x < numCols; x++) {
    const cell = mapInput[y][x];
    if (cell !== '.') {
      antennas.push({ position: { x, y }, frequency: cell });
    }
  }
}

const antinodePositions = new Set<string>();

// Group the antennas based on frequency
const groupedAntennas = antennas.reduce((group, antenna) => {
  if (!group[antenna.frequency]) group[antenna.frequency] = [];
  group[antenna.frequency].push(antenna.position);
  return group;
}, {} as { [freq: string]: Position[] });

// Main loop - place all antinodes
for (const antennaFreqGroup of Object.values(groupedAntennas)) {
  if (antennaFreqGroup.length < 2) continue;

  const positionsSet = new Set<string>();

  // Loop through all antenna pairs in the frequency group
  for (let i = 0; i < antennaFreqGroup.length; i++) {
    positionsSet.add(`${antennaFreqGroup[i].x},${antennaFreqGroup[i].y}`);
    for (let j = i + 1; j < antennaFreqGroup.length; j++) {
      const A = antennaFreqGroup[i];
      const B = antennaFreqGroup[j];

      // Calculate the line
      const deltaX = B.x - A.x;
      const deltaY = B.y - A.y;

      // Get GCD to find all points on the line, with the smallest step size
      const steps = gcd(deltaX, deltaY);

      // Divide by GCD to get correct step size
      const stepX = deltaX / steps;
      const stepY = deltaY / steps;

      // Negative direction
      let x = A.x - stepX;
      let y = A.y - stepY;
      while (x >= 0 && x < numCols && y >= 0 && y < numRows) {
        positionsSet.add(`${x},${y}`);
        x -= stepX;
        y -= stepY;
      }

      // Positive direction
      x = A.x + stepX;
      y = A.y + stepY;
      while (x >= 0 && x < numCols && y >= 0 && y < numRows) {
        positionsSet.add(`${x},${y}`);
        x += stepX;
        y += stepY;
      }
    }
  }

  for (const pos of positionsSet) {
    antinodePositions.add(pos);
  }
}

console.log(`Number of unique antinode positions: ${antinodePositions.size}`);
