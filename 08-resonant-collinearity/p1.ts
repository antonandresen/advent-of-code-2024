import { readFileSync } from 'fs';

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
  for (let i = 0; i < antennaFreqGroup.length; i++) {
    for (let j = i + 1; j < antennaFreqGroup.length; j++) {
      const A = antennaFreqGroup[i];
      const B = antennaFreqGroup[j];

      const antinode1 = {
        x: 2 * B.x - A.x,
        y: 2 * B.y - A.y,
      };
      const antinode2 = {
        x: 2 * A.x - B.x,
        y: 2 * A.y - B.y,
      };

      for (const antinode of [antinode1, antinode2]) {
        const x = antinode.x;
        const y = antinode.y;
        if (Number.isInteger(x) && Number.isInteger(y)) {
          if (x >= 0 && x < numCols && y >= 0 && y < numRows) {
            antinodePositions.add(`${x},${y}`);
          }
        }
      }
    }
  }
}

console.log(`Number of unique antinode positions: ${antinodePositions.size}`);
