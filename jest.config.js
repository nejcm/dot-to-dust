module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['[/\\\\]\\.claude[/\\\\]'],
  modulePathIgnorePatterns: ['[/\\\\]\\.claude[/\\\\]'],
  passWithNoTests: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest-setup.ts',
    '!**/.docs/**',
    '!.claude/**',
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transformIgnorePatterns: [
    `node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@shopify/.*|react-native-reanimated|react-native-mmkv|react-native-nitro-modules|react-native-worklets|zustand|tailwind-merge|tailwind-variants|uniwind|string-length|strip-ansi|char-regex|i18next-icu|intl-messageformat|@formatjs/.*|culori))`,
  ],
  coverageReporters: ['json-summary', ['text', { file: 'coverage.txt' }]],
  coverageDirectory: '<rootDir>/coverage/',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
