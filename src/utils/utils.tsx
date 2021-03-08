export const findCrossover = (samples: Float32Array, triggerLevel: number) => {
  let midIndex = samples.length >> 1;
  // Start upper and lower around midpoint of totalSamples
  let lower = midIndex;
  let upper = 1 + midIndex;

  while (lower >= 0 && upper <= samples.length - 2) {
    if (samples[lower] <= triggerLevel && samples[lower + 1] > triggerLevel) {
      return lower;
    }
    if (samples[upper] <= triggerLevel && samples[upper + 1] > triggerLevel) {
      return upper;
    }
    lower--;
    upper++;
  }
  // No match found, return midpoint
  return midIndex;
};

export const trimSamples = (
  samples: Float32Array,
  crossover: number,
  trimLength: number
): Float32Array => {
  const result = new Float32Array(trimLength);
  const trimMidPoint = trimLength >> 1;

  for (let i = 0; i < trimLength; i++) {
    // Map trim index to smaple index
    let sampleI = crossover + (i - trimMidPoint);
    if (sampleI < 0 || sampleI > samples.length - 1) {
      result[i] = 0;
    } else {
      result[i] = samples[sampleI];
    }
  }

  return result;
};

export const scaleCoordinate = (
  n: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  factor = 1
) => {
  const inRange = inMax - inMin;
  const outRange = outMax - outMin;
  const ratio = (n * factor - inMin) / inRange;
  return ratio * outRange + outMin;
};
