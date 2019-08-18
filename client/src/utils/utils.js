export const findCrossover = (samples, triggerLevel) => {
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

export const trimSamples = (samples, crossover, trimLength) => {
  const result = [];
  const trimMidPoint = trimLength >> 1;

  for (let i = 0; i < trimLength; i++) {
    // Map trim index to smaple index
    let sampleI = crossover + (i - trimMidPoint);
    if (sampleI < 0 || sampleI > samples.length - 1) {
      result.push(0);
    } else {
      result.push(samples[sampleI]);
    }
  }

  return result;
};