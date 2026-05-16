module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupEnv.cjs'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // Stub out CSS/style imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Stub out image/media imports
    '\\.(jpg|jpeg|png|gif|webp|svg|ico)$': '<rootDir>/src/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // framer-motion ships ESM - transform it so Jest can handle it
    '/node_modules/(?!(framer-motion)/)',
  ],
};
