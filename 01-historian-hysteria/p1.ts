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

leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

let totalDistance = 0;

for (let i = 0; i < leftList.length; i++) {
  const distance = Math.abs(leftList[i] - rightList[i]);
  totalDistance += distance;
}

console.log(`Total distance: ${totalDistance}`);