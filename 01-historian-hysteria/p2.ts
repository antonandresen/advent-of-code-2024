import { inputEachRow } from '../utils';

const input = inputEachRow('./01-historian-hysteria/p1.input.txt');

const leftList: number[] = [];
const rightList: number[] = [];

input.forEach(line => {
  const [leftStr, rightStr] = line.trim().split(/\s+/);
  if (leftStr !== undefined && rightStr !== undefined) {
    leftList.push(Number(leftStr));
    rightList.push(Number(rightStr));
  }
});

const rightFreqMap: Map<number, number> = new Map();

rightList.forEach(num => {
  rightFreqMap.set(num, (rightFreqMap.get(num) || 0) + 1);
});

let similarityScore = 0;

leftList.forEach(num => {
  const countInRight = rightFreqMap.get(num) || 0;
  similarityScore += num * countInRight;
});

console.log(`Similarity score: ${similarityScore}`);