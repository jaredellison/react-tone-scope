import { findCrossover, trimSamples, scaleCoordinate } from './utils.js';

describe('findCrossover', () => {
  it('should identify the crossover index', () => {
    const samplesA = [-2, -1, 0, 1, 2];
    const triggerLevelA = 0;
    expect(findCrossover(samplesA, triggerLevelA)).toBe(2);

    const samplesB = [-2, -1, 0, 1, 2];
    const triggerLevelB = 1;
    expect(findCrossover(samplesB, triggerLevelB)).toBe(3);
  });

  it('should return the middle index when triggerLevel is not in array', () => {
    const samples = [-2, -1, 0, 1, 2];
    const triggerLevel = 5;
    expect(findCrossover(samples, triggerLevel)).toBe(2);
  });

  it('should return the middle index when array has no rising edge', () => {
    const samples = [5, 4, 3, 2, 1];
    const triggerLevel = 3;
    expect(findCrossover(samples, triggerLevel)).toBe(2);
  });

  it('should return the middle index when triggerLevel is at end of array', () => {
    const samplesA = [-2, -1, 0, 1, 2];
    const triggerLevelA = 2;
    expect(findCrossover(samplesA, triggerLevelA)).toBe(2);
  });
});

describe('trimSamples', () => {
  it('should trim array to correct length', () => {
    let samples, trimmed;

    samples = new Array(100).fill(1);
    trimmed = trimSamples(samples, 0, 100);
    expect(trimmed.length).toBe(100);

    samples = new Array(100).fill(1);
    trimmed = trimSamples(samples, 2, 100);
    expect(trimmed.length).toBe(100);

    samples = new Array(100).fill(1);
    trimmed = trimSamples(samples, 0, 10);
    expect(trimmed.length).toBe(10);

    samples = new Array(100).fill(1).map((e, i) => i);
    trimmed = trimSamples(samples, 50, 10);
    expect(trimmed.length).toBe(10);
  });

  it('should trim around the crossover', () => {
    let samples, trimmed;

    samples = [0, 1, 2, 3, 4];
    trimmed = trimSamples(samples, 2, 3);
    expect(trimmed).toEqual([1, 2, 3]);

    samples = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    trimmed = trimSamples(samples, 5, 5);
    expect(trimmed).toEqual([3, 4, 5, 6, 7]);
  });

  it('should pad either side of array with 0 when trim is larger than available samples', () => {
    let samples, trimmed;

    samples = [0, 1, 2, 3, 4];
    trimmed = trimSamples(samples, 2, 7);
    expect(trimmed).toEqual([0, 0, 1, 2, 3, 4, 0]);

    samples = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    trimmed = trimSamples(samples, 8, 10);
    expect(trimmed).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 0, 0]);
  });
});

describe('scaleCoordinate', () => {
  it('should scale integers correctly', () => {
    expect(scaleCoordinate(5, 0, 10, 0, 100)).toBeCloseTo(50, 5);
    expect(scaleCoordinate(5, 0, 10, 100, 200)).toBeCloseTo(150, 5);
    expect(scaleCoordinate(5, 0, 10, 0, 1)).toEqual(0.5, 5);
    expect(scaleCoordinate(0.5, 0, 1, 0, 5)).toEqual(2.5, 5);
    expect(scaleCoordinate(0.5, 0, 1, 0, 1)).toEqual(0.5, 5);
  });

  it('should scale floats correctly', () => {
    expect(scaleCoordinate(0.5, 0, 1, 0, 5)).toEqual(2.5, 5);
    expect(scaleCoordinate(0.5, 0, 1, 0, 1)).toEqual(0.5, 5);
  });

  it('should scale negative ranges', () => {
    expect(scaleCoordinate(1.5, 1, 2, 0, -10)).toEqual(-5, 5);
    expect(scaleCoordinate(5, 0, 10, -100, -200)).toEqual(-150, 5);
  });

  it('should multiply result by optional factor parameter', () => {
    expect(scaleCoordinate(0.1, 0, 1, 0, 10, 2)).toEqual(2, 5);
    expect(scaleCoordinate(1, 0, 10, 0, 100, 2)).toEqual(20, 5);
  });
});
