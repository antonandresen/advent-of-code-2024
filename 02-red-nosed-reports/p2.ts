import { inputEachRow } from '../utils';

const input = inputEachRow('./02-red-nosed-reports/p1.input.txt');

function isSafeReport(levels: number[]): boolean {
  if (levels.length < 2) return true;

  const isIncreasing = levels[1] > levels[0];

  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];

    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }

    if (isIncreasing && diff < 0) {
      return false;
    }
    if (!isIncreasing && diff > 0) {
      return false;
    }
  }

  return true;
}

function canBeMadeSafe(levels: number[]): boolean {
  for (let i = 0; i < levels.length; i++) {
    const modifiedLevels = levels.slice(0, i).concat(levels.slice(i + 1));
    if (isSafeReport(modifiedLevels)) {
      return true;
    }
  }
  return false;
}

let safeReports = 0;

input.forEach(line => {
  if (line.trim()) {
    const levels = line.split(/\s+/).map(Number);
    if (isSafeReport(levels) || canBeMadeSafe(levels)) {
      safeReports++;
    }
  }
});

console.log(`Number of safe reports with Problem Dampener: ${safeReports}`);