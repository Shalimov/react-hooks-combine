module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts)$': 'babel-jest',
  },
};
