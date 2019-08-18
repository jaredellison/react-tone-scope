import { findCrossover } from '../utils.js';

test('findCrossover identifies crossover', () => {
  const samplesA = [-2, -1, 0, 1, 2];
  const triggerLevelA = 0;
  expect(findCrossover(samplesA, triggerLevelA)).toBe(2);

  const samplesB = [-2, -1, 0, 1, 2];
  const triggerLevelB = 2;
  expect(findCrossover(samplesB, triggerLevelB)).toBe(4);
});

test('findCrossover returns midpoint when triggerLevel is not in array', () => {
  const samples = [-2, -1, 0, 1, 2];
  const triggerLevel = 5;
  expect(findCrossover(samples, triggerLevel)).toBe(2);
});

test('findCrossover returns midpoint when array has no rising edge', () => {
  const samples = [5, 4, 3, 2, 1];
  const triggerLevel = 3;
  expect(findCrossover(samples, triggerLevel)).toBe(2);
});
