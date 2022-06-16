/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/dist/", "/lib/", "/node_modules/", "nodes/node-red/test"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
  collectCoverageFrom: ["<rootDir>/**/*.ts", "!<rootDir>/**/*.spec.ts", "!<rootDir>/**/*.d.ts", "!<rootDir>/**/*.config.ts"],
  coverageDirectory: "coverage",
  reporters: ["default", "jest-junit"],
};
