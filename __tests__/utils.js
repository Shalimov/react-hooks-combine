export const repeatScenario = (iterations, callback) => {
  for (let i = 0; i < iterations; i += 1) {
    callback(i)
  }
}
