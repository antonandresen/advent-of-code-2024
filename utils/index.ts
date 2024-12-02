import { readFileSync } from 'fs';

export const inputEachRow = (path: string) => {
  return readFileSync(path, 'utf-8')
    .trim()
    .split('\n')
    .map(line => line.trim())
};