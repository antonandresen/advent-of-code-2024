import { readFileSync } from 'fs';

const input = readFileSync('./11-plutonian-pebbles/p2.input.txt', 'utf-8').trim();

const stones = input.split(/\s+/).map(num => num.replace(/^0+/, '') || '0');

const BLINKS = 75;

const memo = new Map<string, bigint>();

function countStones(number: string, blinks: number): bigint {
  const key = `${number}-${blinks}`;
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  if (blinks === 0) {
    return 1n;
  }

  let result = 0n;
  let newStones: string[] = [];

  if (number === '0') {
    // Rule 1
    newStones.push('1');
  } else if (number.length % 2 === 0) {
    // Rule 2
    const half = number.length / 2;
    let leftHalf = number.slice(0, half).replace(/^0+/, '') || '0';
    let rightHalf = number.slice(half).replace(/^0+/, '') || '0';
    newStones.push(leftHalf);
    newStones.push(rightHalf);
  } else {
    // Rule 3
    const newNumber = (BigInt(number) * 2024n).toString();
    newStones.push(newNumber);
  }

  for (const newStone of newStones) {
    result += countStones(newStone, blinks - 1);
  }

  memo.set(key, result);
  return result;
}

let totalStones = 0n;
for (const stone of stones) {
  totalStones += countStones(stone, BLINKS);
}

console.log(`Number of stones after ${BLINKS} blinks: ${totalStones}`);