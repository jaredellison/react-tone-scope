export const trimSamples = (samples, sampleCount, maxSamples, triggerLevel) => {
  // Bitwise shift twice because samples are stereo pairs
  let halfTotalSamples = maxSamples >> 2;
  let halfTrimmedSamples = sampleCount >> 2;
  // Start upper and lower around midpoint of totalSamples
  let lower = halfTotalSamples;
  let upper = 1 + halfTotalSamples;

  while (lower >= 0 && upper <= maxSamples) {
    if (samples[lower] <= triggerLevel && samples[lower + 1] >= triggerLevel) {
      return samples.slice(
        lower - halfTrimmedSamples,
        lower + halfTrimmedSamples
      );
    }
    if (samples[upper] <= triggerLevel && samples[upper + 1] >= triggerLevel) {
      return samples.slice(
        upper - halfTrimmedSamples,
        upper + halfTrimmedSamples
      );
    }
    lower--;
    upper++;
  }

  // No match found, a chunk of samples around the midpoint
  return samples.slice(
    halfTrimmedSamples / 2,
    halfTotalSamples + halfTrimmedSamples / 2
  );
};
