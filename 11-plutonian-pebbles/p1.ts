import { readFileSync } from 'fs';

const input = readFileSync('./11-plutonian-pebbles/p1.input.txt', 'utf-8').trim();

let stones = input.split(/\s+/);

const BLINKS = 25;

for (let blink = 0; blink < BLINKS; blink++) {
  let newStones: string[] = [];

  for (let stone of stones) {
    if (stone === '0') {
      // Rule 1: If stone number is 0, replace with stone numbered 1
      newStones.push('1');
    } else if (stone.length % 2 === 0) {
      // Rule 2: If number has an even number of digits, split into two stones
      const numDigits = stone.length;
      const half = numDigits / 2;
      let leftHalf = stone.slice(0, half).replace(/^0+/, '') || '0'; // Remove leading zeros
      let rightHalf = stone.slice(half).replace(/^0+/, '') || '0';
      newStones.push(leftHalf);
      newStones.push(rightHalf);
    } else {
      // Rule 3: Replace stone's number with old number multiplied by 2024
      const newNumber = (BigInt(stone) * BigInt(2024)).toString();
      newStones.push(newNumber);
    }
  }
  stones = newStones;
}

console.log(`Number of stones after ${BLINKS} blinks: ${stones.length}`);