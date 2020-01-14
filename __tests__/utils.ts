export const repeatScenario = (
  iterations: number,
  callback: (v?: number) => void
) => {
  for (let i = 0; i < iterations; i += 1) {
    callback(i);
  }
};
