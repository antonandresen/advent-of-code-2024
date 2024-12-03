import { inputEachRow } from '../utils';

const input = inputEachRow('./03-mull-it-over/p1.input.txt');

function findValidMultiplications(line: string): number {
  let sum = 0;
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    sum += x * y;
  }

  return sum;
}

let totalSum = 0;

input.forEach(line => {
  totalSum += findValidMultiplications(line);
});

console.log(`Sum of all multiplication results: ${totalSum}`);